import express from 'express';
import {
  createReview,
  getEventReviews,
  createReport,
  getChatMessages,
  sendChatMessage,
  submitContact,
} from '../controllers/miscController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/contact', submitContact);
router.get('/reviews/event/:eventId', getEventReviews);
router.post('/reviews', protect, createReview);
router.post('/reports', protect, createReport);
router.get('/chat/:sessionId', protect, getChatMessages);
router.post('/chat', protect, sendChatMessage);

export default router;
