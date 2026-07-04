import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate, authorize } from '../middleware/auth.js';
import * as analyticsController from '../controllers/analyticsController.js';

const router = Router();

router.get(
  '/admin',
  authenticate,
  authorize('Admin'),
  asyncHandler(analyticsController.getAdminDashboard)
);

router.get(
  '/student',
  authenticate,
  authorize('Student'),
  asyncHandler(analyticsController.getStudentOverview)
);

export default router;
