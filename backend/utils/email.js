import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (!process.env.SMTP_USER) {
    console.warn('Email not configured - emails will be logged to console');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send email notification
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[EMAIL] To: ${to} | Subject: ${subject}`);
    return { success: true, message: 'Email logged (dev mode)' };
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
    text,
  };

  await transporter.sendMail(mailOptions);
  return { success: true };
};

/**
 * Booking confirmation email template
 */
export const sendBookingConfirmation = async (user, booking, event) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Booking Confirmed! 🎉</h1>
      </div>
      <div style="padding: 30px; background: #f9fafb;">
        <p>Hi ${user.name},</p>
        <p>Your booking for <strong>${event.title}</strong> has been confirmed.</p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
          <p><strong>Event Date:</strong> ${new Date(event.date).toLocaleString()}</p>
          <p><strong>Venue:</strong> ${event.venue.name}, ${event.venue.address}</p>
          <p><strong>Tickets:</strong> ${booking.ticketCount}</p>
          <p><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
        </div>
        <p>Please show your QR code at the venue for entry.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: `Booking Confirmed - ${event.title}`,
    html,
  });
};

/**
 * Password reset email
 */
export const sendPasswordResetEmail = async (user, resetUrl) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #10b981; padding: 30px; text-align: center;">
        <h1 style="color: white;">Password Reset</h1>
      </div>
      <div style="padding: 30px;">
        <p>Hi ${user.name},</p>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
        <p>This link expires in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  `;

  return sendEmail({ to: user.email, subject: 'Password Reset Request', html });
};
