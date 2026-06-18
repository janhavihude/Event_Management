import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendResetPasswordToken, resetPassword } from '../utils/passwordReset.js';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role === 'organizer' ? 'organizer' : 'user',
  });

  const token = user.getSignedJwtToken();

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (!user.isActive) {
    return res.status(401).json({ success: false, message: 'Account has been deactivated' });
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = user.getSignedJwtToken();

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      preferences: user.preferences,
    },
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('savedEvents', 'title images date venue');
  res.json({ success: true, user });
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await sendResetPasswordToken(req.body.email);
  res.json(result);
});

/**
 * @desc    Reset password
 * @route   PUT /api/auth/reset-password/:token
 */
export const resetPasswordHandler = asyncHandler(async (req, res) => {
  const result = await resetPassword(req.params.token, req.body.password);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

/**
 * @desc    Google OAuth callback handler
 * @route   GET /api/auth/google/callback
 */
export const googleCallback = asyncHandler(async (req, res) => {
  const token = req.user.getSignedJwtToken();
  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/update-password
 */
export const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = req.body.newPassword;
  await user.save();

  const token = user.getSignedJwtToken();
  res.json({ success: true, token, message: 'Password updated successfully' });
});
