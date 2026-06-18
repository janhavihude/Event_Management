import express from 'express';
import {
  getDashboard,
  getUsers,
  updateUser,
  deleteUser,
  getOrganizers,
  updateOrganizer,
  getPendingEvents,
  updateEventStatus,
  getReports,
  resolveReport,
  createCategory,
  getAnalytics,
  getAllEvents,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/organizers', getOrganizers);
router.put('/organizers/:id', updateOrganizer);
router.get('/events/pending', getPendingEvents);
router.get('/events', getAllEvents);
router.put('/events/:id/status', updateEventStatus);
router.get('/reports', getReports);
router.put('/reports/:id', resolveReport);
router.post('/categories', createCategory);

export default router;
