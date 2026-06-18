import crypto from 'crypto';
import User from '../models/User.js';
import { sendPasswordResetEmail } from './email.js';

/**
 * Generate reset token and send email
 */
export const sendResetPasswordToken = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    return { success: false, message: 'No user found with that email' };
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendPasswordResetEmail(user, resetUrl);

  return { success: true, message: 'Password reset email sent' };
};

/**
 * Reset password with token
 */
export const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return { success: false, message: 'Invalid or expired reset token' };
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return { success: true, message: 'Password reset successful' };
};
