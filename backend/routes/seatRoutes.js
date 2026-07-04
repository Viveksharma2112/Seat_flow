import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { seatRules, mongoIdParam } from '../utils/validators.js';
import * as seatController from '../controllers/seatController.js';

const router = Router();

router.get('/', authenticate, asyncHandler(seatController.getSeats));
router.get('/:id', authenticate, mongoIdParam, validate, asyncHandler(seatController.getSeat));

router.post(
  '/',
  authenticate,
  authorize('Admin'),
  seatRules,
  validate,
  asyncHandler(seatController.createSeat)
);

router.patch(
  '/:id',
  authenticate,
  authorize('Admin'),
  mongoIdParam,
  validate,
  asyncHandler(seatController.updateSeat)
);

router.delete(
  '/:id',
  authenticate,
  authorize('Admin'),
  mongoIdParam,
  validate,
  asyncHandler(seatController.deleteSeat)
);

export default router;
