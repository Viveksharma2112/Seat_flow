import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { parsePagination, buildSort, paginatedResponse } from '../utils/queryBuilder.js';

export const getUsers = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const filter = {};

  if (query.role) filter.role = query.role;
  if (query.status) filter.status = query.status;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }

  const sort = buildSort(query.sortBy || 'createdAt', query.order || 'desc');
  const [users, total] = await Promise.all([
    User.find(filter).select('-password').sort(sort).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return paginatedResponse(users, total, page, limit);
};

export const updateUser = async (id, data) => {
  const allowed = ['name', 'role', 'status'];
  const updates = {};
  for (const key of allowed) {
    if (data[key] !== undefined) updates[key] = data[key];
  }

  const user = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};
