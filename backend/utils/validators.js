import { body, param } from 'express-validator';

export const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['Student', 'Admin']),
];

export const loginRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const reservationRules = [
  body('seatId').isMongoId().withMessage('Valid seat ID is required'),
  body('startTime').isISO8601().withMessage('Valid start time is required'),
  body('endTime').isISO8601().withMessage('Valid end time is required'),
];

export const mongoIdParam = [param('id').isMongoId().withMessage('Invalid ID')];

export const seatRules = [
  body('seatNumber').trim().notEmpty().withMessage('Seat number is required'),
  body('floor').isMongoId().withMessage('Valid floor ID is required'),
  body('section').isMongoId().withMessage('Valid section ID is required'),
  body('status').optional().isIn(['Available', 'Reserved', 'Occupied']),
];

export const floorRules = [
  body('name').trim().notEmpty().withMessage('Floor name is required'),
  body('description').optional().trim(),
  body('isActive').optional().isBoolean(),
];

export const sectionRules = [
  body('name').trim().notEmpty().withMessage('Section name is required'),
  body('floor').isMongoId().withMessage('Valid floor ID is required'),
  body('description').optional().trim(),
  body('isActive').optional().isBoolean(),
];

export const userUpdateRules = [
  body('name').optional().trim().notEmpty(),
  body('role').optional().isIn(['Student', 'Admin']),
  body('status').optional().isIn(['Active', 'Inactive']),
];
