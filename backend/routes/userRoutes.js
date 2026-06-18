import express from 'express';
import {
  getProfile,
  updateProfile,
  getMyBookings,
  getEventHistory,
  getNotifications,
  markNotificationsRead,
  toggleSavedEvent,
  toggleWishlist,
  getRecommendations,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/bookings', getMyBookings);
router.get('/history', getEventHistory);
router.get('/notifications', getNotifications);
router.put('/notifications/read', markNotificationsRead);
router.post('/saved-events/:eventId', toggleSavedEvent);
router.post('/wishlist/:eventId', toggleWishlist);
router.get('/recommendations', getRecommendations);

export default router;
