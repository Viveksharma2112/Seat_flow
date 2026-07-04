import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { floorRules, mongoIdParam } from '../utils/validators.js';
import * as floorController from '../controllers/floorController.js';

const router = Router();

router.get('/', authenticate, asyncHandler(floorController.getFloors));
router.get('/:id', authenticate, mongoIdParam, validate, asyncHandler(floorController.getFloor));

router.post(
  '/',
  authenticate,
  authorize('Admin'),
  floorRules,
  validate,
  asyncHandler(floorController.createFloor)
);

router.patch(
  '/:id',
  authenticate,
  authorize('Admin'),
  mongoIdParam,
  validate,
  asyncHandler(floorController.updateFloor)
);

router.delete(
  '/:id',
  authenticate,
  authorize('Admin'),
  mongoIdParam,
  validate,
  asyncHandler(floorController.deleteFloor)
);

export default router;
