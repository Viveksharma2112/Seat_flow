import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Seat } from '../models/Seat.js';
import { Reservation } from '../models/Reservation.js';

export const getDashboardStats = async () => {
  const [totalUsers, totalSeats, totalReservations, seatStatusCounts] = await Promise.all([
    User.countDocuments(),
    Seat.countDocuments(),
    Reservation.countDocuments(),
    Seat.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);

  const statusMap = seatStatusCounts.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  const occupied = statusMap.Occupied || 0;
  const reserved = statusMap.Reserved || 0;
  const occupancyPercentage = totalSeats
    ? Math.round(((occupied + reserved) / totalSeats) * 100)
    : 0;

  const [mostUsedFloor, mostUsedSection, peakHours, recentBookings, weeklyTrend] = await Promise.all([
    Reservation.aggregate([
      { $match: { status: { $in: ['Active', 'Completed'] } } },
      {
        $lookup: {
          from: 'seats',
          localField: 'seatId',
          foreignField: '_id',
          as: 'seat',
        },
      },
      { $unwind: '$seat' },
      {
        $lookup: {
          from: 'floors',
          localField: 'seat.floor',
          foreignField: '_id',
          as: 'floor',
        },
      },
      { $unwind: '$floor' },
      { $group: { _id: '$floor.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]),
    Reservation.aggregate([
      { $match: { status: { $in: ['Active', 'Completed'] } } },
      {
        $lookup: {
          from: 'seats',
          localField: 'seatId',
          foreignField: '_id',
          as: 'seat',
        },
      },
      { $unwind: '$seat' },
      {
        $lookup: {
          from: 'sections',
          localField: 'seat.section',
          foreignField: '_id',
          as: 'section',
        },
      },
      { $unwind: '$section' },
      { $group: { _id: '$section.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]),
    Reservation.aggregate([
      { $match: { status: { $in: ['Active', 'Completed'] } } },
      {
        $group: {
          _id: { $hour: '$startTime' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    Reservation.find()
      .populate('userId', 'name email')
      .populate({
        path: 'seatId',
        populate: [{ path: 'floor', select: 'name' }, { path: 'section', select: 'name' }],
      })
      .sort({ createdAt: -1 })
      .limit(8),
    Reservation.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const activeBookings = await Reservation.countDocuments({
    status: 'Active',
    endTime: { $gt: new Date() },
  });

  const recentActivities = recentBookings.slice(0, 5).map((booking) => {
    const seatNumber = booking.seatId?.seatNumber || '—';

    let action = `${booking.userId?.name || 'User'} reserved seat ${seatNumber}`;
    if (booking.status === 'Cancelled') {
      action = `${booking.userId?.name || 'User'} cancelled reservation ${seatNumber}`;
    } else if (booking.status === 'Expired') {
      action = `${booking.userId?.name || 'User'} expired reservation ${seatNumber}`;
    } else if (booking.status === 'Completed' && booking.checkedOutAt) {
      action = `${booking.userId?.name || 'User'} checked out of seat ${seatNumber}`;
    } else if (booking.status === 'Completed') {
      action = `${booking.userId?.name || 'User'} completed booking ${seatNumber}`;
    } else if (booking.checkedInAt) {
      action = `${booking.userId?.name || 'User'} checked in to seat ${seatNumber}`;
    }

    return {
      id: String(booking._id),
      action,
      time: booking.checkedOutAt || booking.checkedInAt || booking.createdAt,
      tone: booking.status === 'Cancelled' || booking.status === 'Expired' ? 'cancel' : booking.checkedInAt || booking.status === 'Completed' ? 'complete' : 'reserve',
    };
  });

  return {
    totalUsers,
    totalSeats,
    totalReservations,
    activeBookings,
    occupancyPercentage,
    seatStatus: {
      available: statusMap.Available || 0,
      reserved: statusMap.Reserved || 0,
      occupied: statusMap.Occupied || 0,
    },
    mostUsedFloor: mostUsedFloor[0] || null,
    mostUsedSection: mostUsedSection[0] || null,
    peakBookingHours: peakHours.map((h) => ({
      hour: h._id,
      count: h.count,
    })),
    recentBookings,
    weeklyTrend,
    recentActivities,
  };
};

export const getStudentOverview = async (userId) => {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalBookings, activeBooking, upcomingReservation, monthBookings, recentBookings] = await Promise.all([
    Reservation.countDocuments({ userId }),
    Reservation.findOne({
      userId,
      status: 'Active',
      checkedInAt: { $ne: null },
      endTime: { $gt: now },
    }).populate({
      path: 'seatId',
      populate: [{ path: 'floor', select: 'name' }, { path: 'section', select: 'name' }],
    }),
    Reservation.findOne({
      userId,
      status: 'Active',
      checkedInAt: null,
      startTime: { $gt: now },
    })
      .populate({
        path: 'seatId',
        populate: [{ path: 'floor', select: 'name' }, { path: 'section', select: 'name' }],
      })
      .sort({ startTime: 1 }),
    Reservation.find({
      userId,
      startTime: { $gte: startOfMonth },
      status: { $in: ['Active', 'Completed', 'Cancelled', 'Expired'] },
    }),
    Reservation.find({ userId })
      .populate({
        path: 'seatId',
        populate: [{ path: 'floor', select: 'name' }, { path: 'section', select: 'name' }],
      })
      .sort({ createdAt: -1 })
      .limit(6),
  ]);

  let hoursReservedThisMonth = 0;
  for (const booking of monthBookings) {
    const start = Math.max(booking.startTime.getTime(), startOfMonth.getTime());
    const end = Math.min(booking.endTime.getTime(), now.getTime());
    if (booking.status === 'Cancelled') continue;
    if (end > start) hoursReservedThisMonth += (end - start) / (1000 * 60 * 60);
  }

  const zoneUsage = await Reservation.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: 'seats',
        localField: 'seatId',
        foreignField: '_id',
        as: 'seat',
      },
    },
    { $unwind: '$seat' },
    {
      $lookup: {
        from: 'sections',
        localField: 'seat.section',
        foreignField: '_id',
        as: 'section',
      },
    },
    { $unwind: '$section' },
    { $group: { _id: '$section.name', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);

  const recentActivities = recentBookings.map((booking) => {
    let action = `Reserved Seat ${booking.seatId?.seatNumber || '—'}`;
    let tone = 'reserve';

    if (booking.status === 'Cancelled') {
      action = `Cancelled Reservation ${booking.seatId?.seatNumber || '—'}`;
      tone = 'cancel';
    } else if (booking.status === 'Expired') {
      action = `Expired Reservation ${booking.seatId?.seatNumber || '—'}`;
      tone = 'cancel';
    } else if (booking.status === 'Completed' && booking.checkedOutAt) {
      action = `Checked Out of ${booking.seatId?.seatNumber || '—'}`;
      tone = 'complete';
    } else if (booking.status === 'Completed') {
      action = `Completed Booking ${booking.seatId?.seatNumber || '—'}`;
      tone = 'complete';
    } else if (booking.checkedInAt) {
      action = `Checked In to ${booking.seatId?.seatNumber || '—'}`;
      tone = 'checkin';
    }

    return {
      id: String(booking._id),
      action,
      time: booking.checkedOutAt || booking.checkedInAt || booking.createdAt,
      tone,
      seatNumber: booking.seatId?.seatNumber || '—',
      floor: booking.seatId?.floor?.name || '—',
      section: booking.seatId?.section?.name || '—',
      status: booking.status,
    };
  });

  return {
    totalBookings,
    activeBooking: activeBooking ? 1 : 0,
    upcomingReservation,
    hoursReservedThisMonth: Math.round(hoursReservedThisMonth * 10) / 10,
    mostUsedZone: zoneUsage[0]?._id || null,
    mostUsedSection: zoneUsage[0]?._id || null,
    currentBooking: activeBooking,
    recentActivities,
  };
};
