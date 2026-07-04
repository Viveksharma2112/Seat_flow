import { Seat } from '../models/Seat.js';
import { Floor } from '../models/Floor.js';
import { Section } from '../models/Section.js';
import { ApiError } from '../utils/ApiError.js';
import { parsePagination, buildSort, paginatedResponse } from '../utils/queryBuilder.js';

export const createSeat = async (data) => {
  const [floor, section] = await Promise.all([
    Floor.findById(data.floor),
    Section.findById(data.section),
  ]);

  if (!floor) throw new ApiError(404, 'Floor not found');
  if (!section) throw new ApiError(404, 'Section not found');
  if (section.floor.toString() !== floor._id.toString()) {
    throw new ApiError(400, 'Section does not belong to the selected floor');
  }

  const seat = await Seat.create(data);
  return seat.populate([
    { path: 'floor', select: 'name' },
    { path: 'section', select: 'name' },
  ]);
};

export const getSeats = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.floor) filter.floor = query.floor;
  if (query.section) filter.section = query.section;
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.seatNumber = { $regex: query.search, $options: 'i' };
  }

  const sort = buildSort(query.sortBy || 'seatNumber', query.order);
  const [seats, total] = await Promise.all([
    Seat.find(filter)
      .populate('floor', 'name')
      .populate('section', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Seat.countDocuments(filter),
  ]);

  return paginatedResponse(seats, total, page, limit);
};

export const getSeatById = async (id) => {
  const seat = await Seat.findById(id)
    .populate('floor', 'name')
    .populate('section', 'name');
  if (!seat) throw new ApiError(404, 'Seat not found');
  return seat;
};

export const updateSeat = async (id, data) => {
  if (data.floor || data.section) {
    const seat = await Seat.findById(id);
    if (!seat) throw new ApiError(404, 'Seat not found');

    const floorId = data.floor || seat.floor;
    const sectionId = data.section || seat.section;
    const section = await Section.findById(sectionId);

    if (!section) throw new ApiError(404, 'Section not found');
    if (section.floor.toString() !== floorId.toString()) {
      throw new ApiError(400, 'Section does not belong to the selected floor');
    }
  }

  const updated = await Seat.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate([
    { path: 'floor', select: 'name' },
    { path: 'section', select: 'name' },
  ]);

  if (!updated) throw new ApiError(404, 'Seat not found');
  return updated;
};

export const deleteSeat = async (id) => {
  const seat = await Seat.findByIdAndDelete(id);
  if (!seat) throw new ApiError(404, 'Seat not found');
  return seat;
};
