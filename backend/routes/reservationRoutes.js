import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { reservationRules, mongoIdParam } from '../utils/validators.js';
import * as reservationController from '../controllers/reservationController.js';

const router = Router();

router.get('/current', authenticate, asyncHandler(reservationController.getCurrentBooking));
router.get('/mine', authenticate, asyncHandler(reservationController.getMyReservations));
router.get('/queue', authenticate, asyncHandler(reservationController.getMyQueue));

router.get(
  '/',
  authenticate,
  authorize('Admin'),
  asyncHandler(reservationController.getAllReservations)
);

router.post(
  '/',
  authenticate,
  authorize('Student'),
  reservationRules,
  validate,
  asyncHandler(reservationController.createReservation)
);

router.post(
  '/:id/check-in',
  authenticate,
  authorize('Student'),
  mongoIdParam,
  validate,
  asyncHandler(reservationController.checkIn)
);

router.post(
  '/:id/check-out',
  authenticate,
  authorize('Student'),
  mongoIdParam,
  validate,
  asyncHandler(reservationController.checkOut)
);

router.patch(
  '/:id/cancel',
  authenticate,
  mongoIdParam,
  validate,
  asyncHandler(reservationController.cancelReservation)
);

router.delete(
  '/queue/:id',
  authenticate,
  authorize('Student'),
  mongoIdParam,
  validate,
  asyncHandler(reservationController.cancelQueue)
);

export default router;
