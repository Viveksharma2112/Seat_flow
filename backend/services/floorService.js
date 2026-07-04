import { Floor } from '../models/Floor.js';
import { ApiError } from '../utils/ApiError.js';
import { parsePagination, buildSort, paginatedResponse } from '../utils/queryBuilder.js';

export const createFloor = async (data) => {
  const floor = await Floor.create(data);
  return floor;
};

export const getFloors = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.search) {
    filter.name = { $regex: query.search, $options: 'i' };
  }
  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === 'true';
  }

  const sort = buildSort(query.sortBy, query.order);
  const [floors, total] = await Promise.all([
    Floor.find(filter).sort(sort).skip(skip).limit(limit),
    Floor.countDocuments(filter),
  ]);

  return paginatedResponse(floors, total, page, limit);
};

export const getFloorById = async (id) => {
  const floor = await Floor.findById(id);
  if (!floor) throw new ApiError(404, 'Floor not found');
  return floor;
};

export const updateFloor = async (id, data) => {
  const floor = await Floor.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!floor) throw new ApiError(404, 'Floor not found');
  return floor;
};

export const deleteFloor = async (id) => {
  const floor = await Floor.findByIdAndDelete(id);
  if (!floor) throw new ApiError(404, 'Floor not found');
  return floor;
};
