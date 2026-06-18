import express from 'express';
import {
  createBooking,
  confirmBooking,
  getBooking,
  downloadTicket,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createBooking);
router.get('/:id', getBooking);
router.get('/:id/ticket', downloadTicket);
router.put('/:id/confirm', confirmBooking);
router.put('/:id/cancel', cancelBooking);

export default router;
