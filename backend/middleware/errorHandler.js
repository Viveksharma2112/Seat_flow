import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || null;

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    message = `Duplicate value for ${field}`;
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier';
  }

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
  });
};

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
