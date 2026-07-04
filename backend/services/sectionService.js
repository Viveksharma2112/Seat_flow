import { Section } from '../models/Section.js';
import { Floor } from '../models/Floor.js';
import { ApiError } from '../utils/ApiError.js';
import { parsePagination, buildSort, paginatedResponse } from '../utils/queryBuilder.js';

export const createSection = async (data) => {
  const floor = await Floor.findById(data.floor);
  if (!floor) throw new ApiError(404, 'Floor not found');

  const section = await Section.create(data);
  return section.populate('floor', 'name');
};

export const getSections = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.floor) filter.floor = query.floor;
  if (query.search) filter.name = { $regex: query.search, $options: 'i' };
  if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';

  const sort = buildSort(query.sortBy, query.order);
  const [sections, total] = await Promise.all([
    Section.find(filter).populate('floor', 'name').sort(sort).skip(skip).limit(limit),
    Section.countDocuments(filter),
  ]);

  return paginatedResponse(sections, total, page, limit);
};

export const getSectionById = async (id) => {
  const section = await Section.findById(id).populate('floor', 'name');
  if (!section) throw new ApiError(404, 'Section not found');
  return section;
};

export const updateSection = async (id, data) => {
  if (data.floor) {
    const floor = await Floor.findById(data.floor);
    if (!floor) throw new ApiError(404, 'Floor not found');
  }

  const section = await Section.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('floor', 'name');

  if (!section) throw new ApiError(404, 'Section not found');
  return section;
};

export const deleteSection = async (id) => {
  const section = await Section.findByIdAndDelete(id);
  if (!section) throw new ApiError(404, 'Section not found');
  return section;
};
