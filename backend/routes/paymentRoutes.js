import express from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createStripeIntent,
  getPaymentHistory,
  processRefund,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);
router.post('/stripe/create-intent', createStripeIntent);
router.get('/history', getPaymentHistory);
router.post('/:id/refund', authorize('admin', 'organizer'), processRefund);

export default router;
