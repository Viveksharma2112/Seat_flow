import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { sectionRules, mongoIdParam } from '../utils/validators.js';
import * as sectionController from '../controllers/sectionController.js';

const router = Router();

router.get('/', authenticate, asyncHandler(sectionController.getSections));
router.get('/:id', authenticate, mongoIdParam, validate, asyncHandler(sectionController.getSection));

router.post(
  '/',
  authenticate,
  authorize('Admin'),
  sectionRules,
  validate,
  asyncHandler(sectionController.createSection)
);

router.patch(
  '/:id',
  authenticate,
  authorize('Admin'),
  mongoIdParam,
  validate,
  asyncHandler(sectionController.updateSection)
);

router.delete(
  '/:id',
  authenticate,
  authorize('Admin'),
  mongoIdParam,
  validate,
  asyncHandler(sectionController.deleteSection)
);

export default router;
