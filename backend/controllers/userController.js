import * as userService from '../services/userService.js';

export const getUsers = async (req, res) => {
  const result = await userService.getUsers(req.query);
  res.json({ success: true, ...result });
};

export const updateUser = async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.json({ success: true, user });
};

export const deleteUser = async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.json({ success: true, message: 'User deleted' });
};
