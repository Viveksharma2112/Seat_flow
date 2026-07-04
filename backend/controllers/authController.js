import * as authService from '../services/authService.js';

export const register = async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json({ success: true, ...result });
};

export const login = async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.json({ success: true, ...result });
};

export const getMe = async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  res.json({ success: true, user });
};
