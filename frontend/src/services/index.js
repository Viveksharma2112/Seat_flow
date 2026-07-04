import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const seatService = {
  getAll: (params) => api.get('/seats', { params }),
  getById: (id) => api.get(`/seats/${id}`),
  create: (data) => api.post('/seats', data),
  update: (id, data) => api.patch(`/seats/${id}`, data),
  remove: (id) => api.delete(`/seats/${id}`),
};

export const floorService = {
  getAll: (params) => api.get('/floors', { params }),
  create: (data) => api.post('/floors', data),
  update: (id, data) => api.patch(`/floors/${id}`, data),
  remove: (id) => api.delete(`/floors/${id}`),
};

export const sectionService = {
  getAll: (params) => api.get('/sections', { params }),
  create: (data) => api.post('/sections', data),
  update: (id, data) => api.patch(`/sections/${id}`, data),
  remove: (id) => api.delete(`/sections/${id}`),
};

export const reservationService = {
  getCurrent: () => api.get('/reservations/current'),
  getMine: (params) => api.get('/reservations/mine', { params }),
  getAll: (params) => api.get('/reservations', { params }),
  create: (data) => api.post('/reservations', data),
  cancel: (id) => api.patch(`/reservations/${id}/cancel`),
  checkIn: (id) => api.post(`/reservations/${id}/check-in`),
  checkOut: (id) => api.post(`/reservations/${id}/check-out`),
  getQueue: () => api.get('/reservations/queue'),
  cancelQueue: (id) => api.delete(`/reservations/queue/${id}`),
};

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  update: (id, data) => api.patch(`/users/${id}`, data),
  remove: (id) => api.delete(`/users/${id}`),
};

export const analyticsService = {
  getAdmin: () => api.get('/analytics/admin'),
  getStudent: () => api.get('/analytics/student'),
};
