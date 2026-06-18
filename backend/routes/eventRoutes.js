import express from 'express';
import {
  getEvents,
  getFeaturedEvents,
  getEvent,
  getEventSeats,
  getCategories,
  getStats,
  getCalendarEvents,
} from '../controllers/eventController.js';

const router = express.Router();

router.get('/stats', getStats);
router.get('/featured', getFeaturedEvents);
router.get('/categories/all', getCategories);
router.get('/calendar', getCalendarEvents);
router.get('/', getEvents);
router.get('/:id/seats', getEventSeats);
router.get('/:id', getEvent);

export default router;
