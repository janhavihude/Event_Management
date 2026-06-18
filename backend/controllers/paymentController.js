import Razorpay from 'razorpay';
import Stripe from 'stripe';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { confirmBooking } from './bookingController.js';

let razorpay, stripe;

if (process.env.RAZORPAY_KEY_ID) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

/**
 * @desc    Create Razorpay order
 * @route   POST /api/payments/razorpay/create-order
 */
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { bookingId, amount } = req.body;

  if (!razorpay) {
    // Dev mode - simulate payment
    const payment = await Payment.create({
      user: req.user.id,
      booking: bookingId,
      amount,
      provider: 'razorpay',
      providerOrderId: `order_dev_${Date.now()}`,
      status: 'completed',
    });

    const booking = await Booking.findByIdAndUpdate(bookingId, {
      status: 'confirmed',
      payment: payment._id,
    });

    return res.json({
      success: true,
      devMode: true,
      payment,
      message: 'Payment simulated (Razorpay not configured)',
    });
  }

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: 'INR',
    receipt: `booking_${bookingId}`,
  });

  await Payment.create({
    user: req.user.id,
    booking: bookingId,
    amount,
    provider: 'razorpay',
    providerOrderId: order.id,
    status: 'pending',
  });

  res.json({
    success: true,
    order: {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    },
  });
});

/**
 * @desc    Verify Razorpay payment
 * @route   POST /api/payments/razorpay/verify
 */
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

  const sign = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest('hex');

  if (expectedSign !== razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }

  const payment = await Payment.findOneAndUpdate(
    { providerOrderId: razorpay_order_id },
    { providerPaymentId: razorpay_payment_id, status: 'completed' },
    { new: true }
  );

  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { status: 'confirmed', payment: payment._id },
    { new: true }
  ).populate('event user');

  res.json({ success: true, payment, booking });
});

/**
 * @desc    Create Stripe payment intent
 * @route   POST /api/payments/stripe/create-intent
 */
export const createStripeIntent = asyncHandler(async (req, res) => {
  const { bookingId, amount } = req.body;

  if (!stripe) {
    const payment = await Payment.create({
      user: req.user.id,
      booking: bookingId,
      amount,
      provider: 'stripe',
      providerPaymentId: `pi_dev_${Date.now()}`,
      status: 'completed',
    });

    await Booking.findByIdAndUpdate(bookingId, {
      status: 'confirmed',
      payment: payment._id,
    });

    return res.json({
      success: true,
      devMode: true,
      message: 'Payment simulated (Stripe not configured)',
    });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: 'inr',
    metadata: { bookingId, userId: req.user.id },
  });

  await Payment.create({
    user: req.user.id,
    booking: bookingId,
    amount,
    provider: 'stripe',
    providerPaymentId: paymentIntent.id,
    status: 'pending',
  });

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});

/**
 * @desc    Get payment history
 * @route   GET /api/payments/history
 */
export const getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user.id })
    .populate('booking', 'bookingReference event')
    .populate({ path: 'booking', populate: { path: 'event', select: 'title' } })
    .sort({ createdAt: -1 });

  res.json({ success: true, payments });
});

/**
 * @desc    Process refund
 * @route   POST /api/payments/:id/refund
 */
export const processRefund = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate('booking');

  if (!payment) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }

  const refundAmount = req.body.amount || payment.amount;

  if (payment.provider === 'razorpay' && razorpay && payment.providerPaymentId) {
    await razorpay.payments.refund(payment.providerPaymentId, {
      amount: refundAmount * 100,
    });
  } else if (payment.provider === 'stripe' && stripe && payment.providerPaymentId) {
    await stripe.refunds.create({
      payment_intent: payment.providerPaymentId,
      amount: refundAmount * 100,
    });
  }

  payment.status = refundAmount === payment.amount ? 'refunded' : 'partially_refunded';
  payment.refundAmount = refundAmount;
  payment.refundReason = req.body.reason;
  payment.refundedAt = new Date();
  await payment.save();

  if (payment.booking) {
    await Booking.findByIdAndUpdate(payment.booking._id, { status: 'refunded' });
  }

  res.json({ success: true, payment, message: 'Refund processed' });
});
