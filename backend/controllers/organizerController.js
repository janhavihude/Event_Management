import Event from '../models/Event.js';
import Organizer from '../models/Organizer.js';
import Category from '../models/Category.js';
import Booking from '../models/Booking.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generateSeats } from '../utils/ticket.js';
import { createNotification } from '../utils/notification.js';

/**
 * Helper: get organizer profile for current user
 */
const getOrganizerProfile = async (userId) => {
  return await Organizer.findOne({ user: userId });
};

/**
 * @desc    Create new event
 * @route   POST /api/organizer/events
 */
export const createEvent = asyncHandler(async (req, res) => {
  let organizer = await getOrganizerProfile(req.user.id);

  if (!organizer) {
    organizer = await Organizer.create({
      user: req.user.id,
      organizationName: req.body.organizationName || req.user.name + "'s Events",
    });
    await (await import('../models/User.js')).default.findByIdAndUpdate(req.user.id, { role: 'organizer' });
  }

  const seats = generateSeats(req.body.totalSeats, req.body.ticketPricing);

  const event = await Event.create({
    ...req.body,
    organizer: organizer._id,
    availableSeats: req.body.totalSeats,
    seats,
    status: 'pending',
  });

  organizer.totalEvents += 1;
  await organizer.save();

  await Category.findByIdAndUpdate(req.body.category, { $inc: { eventCount: 1 } });

  res.status(201).json({ success: true, event });
});

/**
 * @desc    Get organizer's events
 * @route   GET /api/organizer/events
 */
export const getMyEvents = asyncHandler(async (req, res) => {
  const organizer = await getOrganizerProfile(req.user.id);
  if (!organizer) {
    return res.json({ success: true, events: [] });
  }

  const events = await Event.find({ organizer: organizer._id })
    .populate('category', 'name icon')
    .sort({ createdAt: -1 });

  res.json({ success: true, events });
});

/**
 * @desc    Update event
 * @route   PUT /api/organizer/events/:id
 */
export const updateEvent = asyncHandler(async (req, res) => {
  const organizer = await getOrganizerProfile(req.user.id);
  let event = await Event.findOne({ _id: req.params.id, organizer: organizer?._id });

  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, event });
});

/**
 * @desc    Delete event
 * @route   DELETE /api/organizer/events/:id
 */
export const deleteEvent = asyncHandler(async (req, res) => {
  const organizer = await getOrganizerProfile(req.user.id);
  const event = await Event.findOne({ _id: req.params.id, organizer: organizer?._id });

  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  await event.deleteOne();
  res.json({ success: true, message: 'Event deleted' });
});

/**
 * @desc    Get event analytics
 * @route   GET /api/organizer/events/:id/analytics
 */
export const getEventAnalytics = asyncHandler(async (req, res) => {
  const organizer = await getOrganizerProfile(req.user.id);
  const event = await Event.findOne({ _id: req.params.id, organizer: organizer?._id });

  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  const bookings = await Booking.find({ event: event._id, status: 'confirmed' });
  const revenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const ticketTypes = { regular: 0, vip: 0, premium: 0 };

  bookings.forEach((b) => {
    b.seats.forEach((s) => {
      ticketTypes[s.type] = (ticketTypes[s.type] || 0) + 1;
    });
  });

  res.json({
    success: true,
    analytics: {
      totalBookings: bookings.length,
      totalTickets: bookings.reduce((sum, b) => sum + b.ticketCount, 0),
      revenue,
      views: event.views,
      availableSeats: event.availableSeats,
      totalSeats: event.totalSeats,
      occupancyRate: ((event.totalSeats - event.availableSeats) / event.totalSeats * 100).toFixed(1),
      ticketTypes,
    },
  });
});

/**
 * @desc    Get attendees for an event
 * @route   GET /api/organizer/events/:id/attendees
 */
export const getAttendees = asyncHandler(async (req, res) => {
  const organizer = await getOrganizerProfile(req.user.id);
  const event = await Event.findOne({ _id: req.params.id, organizer: organizer?._id });

  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  const bookings = await Booking.find({ event: event._id, status: { $in: ['confirmed', 'used'] } })
    .populate('user', 'name email phone avatar')
    .sort({ createdAt: -1 });

  res.json({ success: true, attendees: bookings });
});

/**
 * @desc    Verify QR ticket
 * @route   POST /api/organizer/verify-ticket
 */
export const verifyTicket = asyncHandler(async (req, res) => {
  const { bookingReference } = req.body;
  const booking = await Booking.findOne({ bookingReference })
    .populate('user', 'name email')
    .populate('event', 'title date');

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Invalid ticket' });
  }

  if (booking.checkedIn) {
    return res.status(400).json({
      success: false,
      message: 'Ticket already used',
      checkedInAt: booking.checkedInAt,
    });
  }

  booking.checkedIn = true;
  booking.checkedInAt = new Date();
  booking.status = 'used';
  await booking.save();

  res.json({
    success: true,
    message: 'Ticket verified successfully',
    attendee: booking.user,
    event: booking.event,
  });
});

/**
 * @desc    Get organizer dashboard stats
 * @route   GET /api/organizer/dashboard
 */
export const getOrganizerDashboard = asyncHandler(async (req, res) => {
  const organizer = await getOrganizerProfile(req.user.id);
  if (!organizer) {
    return res.json({
      success: true,
      stats: { totalEvents: 0, totalRevenue: 0, totalBookings: 0, upcomingEvents: 0 },
    });
  }

  const events = await Event.find({ organizer: organizer._id });
  const eventIds = events.map((e) => e._id);
  const bookings = await Booking.find({ event: { $in: eventIds }, status: 'confirmed' });
  const revenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const upcomingEvents = events.filter((e) => e.date > new Date() && e.status === 'approved').length;

  res.json({
    success: true,
    stats: {
      totalEvents: events.length,
      totalRevenue: revenue,
      totalBookings: bookings.length,
      upcomingEvents,
    },
    recentEvents: events.slice(0, 5),
  });
});

/**
 * @desc    Get organizer profile
 * @route   GET /api/organizer/profile
 */
export const getOrganizerProfileHandler = asyncHandler(async (req, res) => {
  const organizer = await Organizer.findOne({ user: req.user.id }).populate('user', 'name email avatar');
  res.json({ success: true, organizer });
});

/**
 * @desc    Update organizer profile
 * @route   PUT /api/organizer/profile
 */
export const updateOrganizerProfile = asyncHandler(async (req, res) => {
  const organizer = await Organizer.findOneAndUpdate(
    { user: req.user.id },
    req.body,
    { new: true, upsert: true, runValidators: true }
  );
  res.json({ success: true, organizer });
});
