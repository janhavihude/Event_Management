import express from 'express';
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPasswordHandler,
  googleCallback,
  updatePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import passport from 'passport';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPasswordHandler);
router.put('/update-password', protect, updatePassword);

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

export default router;
