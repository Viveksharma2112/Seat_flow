import * as analyticsService from '../services/analyticsService.js';

export const getAdminDashboard = async (req, res) => {
  const stats = await analyticsService.getDashboardStats();
  res.json({ success: true, stats });
};

export const getStudentOverview = async (req, res) => {
  const overview = await analyticsService.getStudentOverview(req.user.id);
  res.json({ success: true, overview });
};
