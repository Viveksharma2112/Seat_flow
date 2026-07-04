export const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const buildSort = (sortBy = 'createdAt', order = 'desc') => {
  const allowed = ['createdAt', 'name', 'email', 'seatNumber', 'floor', 'section', 'startTime', 'status'];
  const field = allowed.includes(sortBy) ? sortBy : 'createdAt';
  const direction = order === 'asc' ? 1 : -1;
  return { [field]: direction };
};

export const paginatedResponse = (data, total, page, limit) => ({
  data,
  pagination: {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit) || 1,
  },
});
