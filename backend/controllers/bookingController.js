import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import Payment from '../models/Payment.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generateBookingReference, generateQRCode, generateTicketPDF } from '../utils/ticket.js';
import { sendBookingConfirmation } from '../utils/email.js';
import { createNotification } from '../utils/notification.js';

/**
 * @desc    Create booking
 * @route   POST /api/bookings
 */
export const createBooking = asyncHandler(async (req, res) => {
  const { eventId, seats, paymentProvider = 'razorpay' } = req.body;

  const event = await Event.findById(eventId);
  if (!event || event.status !== 'approved') {
    return res.status(404).json({ success: false, message: 'Event not available for booking' });
  }

  if (event.date < new Date()) {
    return res.status(400).json({ success: false, message: 'Event has already passed' });
  }

  // Validate and reserve seats
  let totalAmount = 0;
  const bookedSeats = [];

  for (const seatReq of seats) {
    const seat = event.seats.find(
      (s) => s.row === seatReq.row && s.number === seatReq.number && !s.isBooked
    );
    if (!seat) {
      return res.status(400).json({
        success: false,
        message: `Seat ${seatReq.row}${seatReq.number} is not available`,
      });
    }
    seat.isBooked = true;
    totalAmount += seat.price;
    bookedSeats.push({ row: seat.row, number: seat.number, type: seat.type, price: seat.price });
  }

  event.availableSeats -= seats.length;
  await event.save();

  const bookingReference = generateBookingReference();
  const qrData = { ref: bookingReference, event: eventId, user: req.user.id };
  const qrCode = await generateQRCode(qrData);

  const booking = await Booking.create({
    user: req.user.id,
    event: eventId,
    seats: bookedSeats,
    totalAmount,
    ticketCount: seats.length,
    bookingReference,
    qrCode,
    status: 'pending',
  });

  res.status(201).json({
    success: true,
    booking,
    paymentRequired: true,
    amount: totalAmount,
    provider: paymentProvider,
  });
});

/**
 * @desc    Confirm booking after payment
 * @route   PUT /api/bookings/:id/confirm
 */
export const confirmBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('event')
    .populate('user', 'name email');

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  booking.status = 'confirmed';
  booking.payment = req.body.paymentId;
  await booking.save();

  const event = await Event.findByIdAndUpdate(booking.event._id, {
    $inc: { totalBookings: 1, revenue: booking.totalAmount },
  });

  const io = req.app.get('io');
  await createNotification(io, {
    userId: booking.user._id,
    title: 'Booking Confirmed!',
    message: `Your booking for ${booking.event.title} is confirmed.`,
    type: 'booking',
    link: `/dashboard/bookings/${booking._id}`,
  });

  await sendBookingConfirmation(booking.user, booking, booking.event);

  res.json({ success: true, booking });
});

/**
 * @desc    Get booking by ID
 * @route   GET /api/bookings/:id
 */
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('event', 'title images date venue')
    .populate('user', 'name email')
    .populate('payment');

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  if (booking.user._id.toString() !== req.user.id && req.user.role === 'user') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  res.json({ success: true, booking });
});

/**
 * @desc    Download ticket PDF
 * @route   GET /api/bookings/:id/ticket
 */
export const downloadTicket = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('event')
    .populate('user', 'name email');

  if (!booking || booking.status !== 'confirmed') {
    return res.status(404).json({ success: false, message: 'Ticket not available' });
  }

  const pdfBuffer = await generateTicketPDF(booking, booking.event, booking.user);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=ticket-${booking.bookingReference}.pdf`);
  res.send(pdfBuffer);
});

/**
 * @desc    Cancel booking
 * @route   PUT /api/bookings/:id/cancel
 */
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('event');

  if (!booking || booking.user.toString() !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  if (booking.status !== 'confirmed' && booking.status !== 'pending') {
    return res.status(400).json({ success: false, message: 'Cannot cancel this booking' });
  }

  // Release seats
  const event = await Event.findById(booking.event._id);
  booking.seats.forEach((bookedSeat) => {
    const seat = event.seats.find(
      (s) => s.row === bookedSeat.row && s.number === bookedSeat.number
    );
    if (seat) seat.isBooked = false;
  });
  event.availableSeats += booking.seats.length;
  await event.save();

  booking.status = 'cancelled';
  await booking.save();

  res.json({ success: true, message: 'Booking cancelled', booking });
});
