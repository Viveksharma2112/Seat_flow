import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { env } from '../config/env.js';

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required');
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret);

    const user = await User.findById(decoded.id);
    if (!user || user.status === 'Inactive') {
      throw new ApiError(401, 'Invalid or inactive account');
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Invalid or expired token'));
    }
    next(error);
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Insufficient permissions'));
  }
  next();
};
