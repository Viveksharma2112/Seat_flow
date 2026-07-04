import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { signToken } from '../utils/jwt.js';

export const registerUser = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'Email already registered');
  }

  const safeRole = 'Student';
  const user = await User.create({ name, email, password, role: safeRole });

  const token = signToken(user._id, user.role);
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.status === 'Inactive') {
    throw new ApiError(403, 'Account is inactive');
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken(user._id, user.role);
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};
