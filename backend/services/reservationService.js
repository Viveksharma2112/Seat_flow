import mongoose from 'mongoose';
import { Reservation } from '../models/Reservation.js';
import { Seat } from '../models/Seat.js';
import { ApiError } from '../utils/ApiError.js';
import { parsePagination, buildSort, paginatedResponse } from '../utils/queryBuilder.js';
import { joinWaitQueue, processNextInQueue } from './queueService.js';

const validateTimeRange = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new ApiError(400, 'Invalid date range');
  }
  if (start >= end) {
    throw new ApiError(400, 'End time must be after start time');
  }
  if (start < now) {
    throw new ApiError(400, 'Start time cannot be in the past');
  }
  return { start, end };
};

const releaseSeatAndProcessQueue = async ({ reservation, session }) => {
  await Seat.findByIdAndUpdate(reservation.seatId, { status: 'Available' }, { session });

  const next = await processNextInQueue(reservation.seatId, session);
  if (next) {
    await createReservationInSession({
      userId: next.userId,
      seatId: next.seatId,
      start: next.startTime,
      end: next.endTime,
      session,
    });
  }
};

const createReservationInSession = async ({ userId, seatId, start, end, session }) => {
  const activeUserBooking = await Reservation.findOne({
    userId,
    status: 'Active',
    endTime: { $gt: new Date() },
  }).session(session);

  if (activeUserBooking) {
    throw new ApiError(409, 'You already have an active reservation');
  }

  const seat = await Seat.findById(seatId).session(session);
  if (!seat) throw new ApiError(404, 'Seat not found');

  if (seat.status !== 'Available') {
    throw new ApiError(409, 'Seat is not available');
  }

  const updatedSeat = await Seat.findOneAndUpdate(
    { _id: seatId, status: 'Available' },
    { status: 'Reserved' },
    { new: true, session }
  );

  if (!updatedSeat) {
    throw new ApiError(409, 'Seat was just reserved by another user');
  }

  const overlapping = await Reservation.findOne({
    seatId,
    status: 'Active',
    startTime: { $lt: end },
    endTime: { $gt: start },
  }).session(session);

  if (overlapping) {
    await Seat.findByIdAndUpdate(seatId, { status: seat.status }, { session });
    throw new ApiError(409, 'Seat has a conflicting reservation');
  }

  const [reservation] = await Reservation.create(
    [{ userId, seatId, startTime: start, endTime: end, status: 'Active' }],
    { session }
  );

  return reservation;
};

export const createReservation = async ({ userId, seatId, startTime, endTime }) => {
  const { start, end } = validateTimeRange(startTime, endTime);

  const seat = await Seat.findById(seatId);
  if (!seat) throw new ApiError(404, 'Seat not found');

  if (seat.status !== 'Available') {
    const queueEntry = await joinWaitQueue({ userId, seatId, startTime: start, endTime: end });
    return {
      queued: true,
      queueEntry,
      message: 'Seat unavailable. Added to waiting queue.',
    };
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const reservation = await createReservationInSession({
      userId,
      seatId,
      start,
      end,
      session,
    });

    await session.commitTransaction();
    return { queued: false, reservation };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const cancelReservation = async (userId, reservationId, isAdmin = false) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const filter = isAdmin ? { _id: reservationId } : { _id: reservationId, userId };
    const reservation = await Reservation.findOne(filter).session(session);

    if (!reservation) throw new ApiError(404, 'Reservation not found');
    if (reservation.status !== 'Active') {
      throw new ApiError(400, 'Only active reservations can be cancelled');
    }

    reservation.status = 'Cancelled';
    await reservation.save({ session });

    await releaseSeatAndProcessQueue({ reservation, session });

    await session.commitTransaction();
    return reservation;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const checkIn = async (userId, reservationId) => {
  const reservation = await Reservation.findOne({
    _id: reservationId,
    userId,
    status: 'Active',
  });

  if (!reservation) throw new ApiError(404, 'Active reservation not found');

  const now = new Date();
  if (now < reservation.startTime) {
    throw new ApiError(400, 'Check-in opens at reservation start time');
  }
  if (now > reservation.endTime) {
    throw new ApiError(400, 'Reservation has expired');
  }

  reservation.checkedInAt = now;
  await reservation.save();
  await Seat.findByIdAndUpdate(reservation.seatId, { status: 'Occupied' });

  return reservation.populate({
    path: 'seatId',
    populate: [{ path: 'floor', select: 'name' }, { path: 'section', select: 'name' }],
  });
};

export const checkOut = async (userId, reservationId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const reservation = await Reservation.findOne({
      _id: reservationId,
      userId,
      status: 'Active',
    }).session(session);

    if (!reservation) throw new ApiError(404, 'Active reservation not found');
    if (!reservation.checkedInAt) {
      throw new ApiError(400, 'Check-in required before check-out');
    }

    reservation.status = 'Completed';
    reservation.checkedOutAt = new Date();
    await reservation.save({ session });

    await releaseSeatAndProcessQueue({ reservation, session });

    await session.commitTransaction();

    return reservation.populate({
      path: 'seatId',
      populate: [{ path: 'floor', select: 'name' }, { path: 'section', select: 'name' }],
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getCurrentBooking = async (userId) => {
  const reservation = await Reservation.findOne({
    userId,
    status: 'Active',
    endTime: { $gt: new Date() },
  })
    .populate({
      path: 'seatId',
      populate: [{ path: 'floor', select: 'name' }, { path: 'section', select: 'name' }],
    })
    .sort({ startTime: 1 });

  return reservation;
};

export const getUserReservations = async (userId, query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = { userId };

  if (query.status) filter.status = query.status;
  if (query.tab === 'current') {
    filter.status = 'Active';
    filter.endTime = { $gt: new Date() };
  }
  if (query.tab === 'history') {
    filter.status = { $in: ['Completed', 'Cancelled', 'Expired'] };
  }

  const sort = buildSort(query.sortBy || 'startTime', query.order || 'desc');
  const [reservations, total] = await Promise.all([
    Reservation.find(filter)
      .populate({
        path: 'seatId',
        populate: [{ path: 'floor', select: 'name' }, { path: 'section', select: 'name' }],
      })
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Reservation.countDocuments(filter),
  ]);

  return paginatedResponse(reservations, total, page, limit);
};

export const getAllReservations = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.userId) filter.userId = query.userId;
  if (query.seatId) filter.seatId = query.seatId;
  if (query.search) {
    filter.$or = [{ status: { $regex: query.search, $options: 'i' } }];
  }

  const sort = buildSort(query.sortBy || 'createdAt', query.order || 'desc');
  const [reservations, total] = await Promise.all([
    Reservation.find(filter)
      .populate('userId', 'name email')
      .populate({
        path: 'seatId',
        populate: [{ path: 'floor', select: 'name' }, { path: 'section', select: 'name' }],
      })
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Reservation.countDocuments(filter),
  ]);

  return paginatedResponse(reservations, total, page, limit);
};

export const expireStaleReservations = async () => {
  const now = new Date();
  const expired = await Reservation.find({
    status: 'Active',
    endTime: { $lte: now },
  });

  for (const reservation of expired) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      reservation.status = 'Expired';
      await reservation.save({ session });
      await Seat.findByIdAndUpdate(reservation.seatId, { status: 'Available' }, { session });

      const next = await processNextInQueue(reservation.seatId, session);
      if (next) {
        await createReservationInSession({
          userId: next.userId,
          seatId: next.seatId,
          start: next.startTime,
          end: next.endTime,
          session,
        });
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.error('Failed to expire reservation:', reservation._id, error.message);
    } finally {
      session.endSession();
    }
  }

  const completed = await Reservation.updateMany(
    {
      status: 'Active',
      checkedInAt: { $ne: null },
      endTime: { $lte: now },
    },
    { status: 'Completed' }
  );

  return { expired: expired.length, completed: completed.modifiedCount };
};
