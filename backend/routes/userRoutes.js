import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { userUpdateRules, mongoIdParam } from '../utils/validators.js';
import * as userController from '../controllers/userController.js';

const router = Router();

router.get('/', authenticate, authorize('Admin'), asyncHandler(userController.getUsers));

router.patch(
  '/:id',
  authenticate,
  authorize('Admin'),
  mongoIdParam,
  userUpdateRules,
  validate,
  asyncHandler(userController.updateUser)
);

router.delete(
  '/:id',
  authenticate,
  authorize('Admin'),
  mongoIdParam,
  validate,
  asyncHandler(userController.deleteUser)
);

export default router;
