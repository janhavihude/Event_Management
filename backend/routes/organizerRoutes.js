import express from 'express';
import {
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
  getEventAnalytics,
  getAttendees,
  verifyTicket,
  getOrganizerDashboard,
  getOrganizerProfileHandler,
  updateOrganizerProfile,
} from '../controllers/organizerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('organizer', 'admin'));

router.get('/dashboard', getOrganizerDashboard);
router.get('/profile', getOrganizerProfileHandler);
router.put('/profile', updateOrganizerProfile);
router.post('/events', createEvent);
router.get('/events', getMyEvents);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);
router.get('/events/:id/analytics', getEventAnalytics);
router.get('/events/:id/attendees', getAttendees);
router.post('/verify-ticket', verifyTicket);

export default router;
