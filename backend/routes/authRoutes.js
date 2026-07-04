import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { registerRules, loginRules } from '../utils/validators.js';
import * as authController from '../controllers/authController.js';

const router = Router();

router.post('/register', registerRules, validate, asyncHandler(authController.register));
router.post('/login', loginRules, validate, asyncHandler(authController.login));
router.get('/me', authenticate, asyncHandler(authController.getMe));

export default router;
