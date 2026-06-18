import Event from '../models/Event.js';
import Category from '../models/Category.js';
import Review from '../models/Review.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * @desc    Get all approved events with filters
 * @route   GET /api/events
 */
export const getEvents = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    city,
    minPrice,
    maxPrice,
    date,
    status = 'approved',
    sort = '-date',
    page = 1,
    limit = 12,
  } = req.query;

  const query = { status };

  if (search) {
    query.$text = { $search: search };
  }
  if (category) query.category = category;
  if (city) query['venue.city'] = new RegExp(city, 'i');
  if (minPrice || maxPrice) {
    query['ticketPricing.regular'] = {};
    if (minPrice) query['ticketPricing.regular'].$gte = Number(minPrice);
    if (maxPrice) query['ticketPricing.regular'].$lte = Number(maxPrice);
  }
  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    query.date = { $gte: startDate, $lt: endDate };
  } else {
    query.date = { $gte: new Date() };
  }

  const skip = (page - 1) * limit;
  const events = await Event.find(query)
    .populate('category', 'name icon slug')
    .populate('organizer', 'organizationName logo isVerified')
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Event.countDocuments(query);

  res.json({
    success: true,
    count: events.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: Number(page),
    events,
  });
});

/**
 * @desc    Get featured/upcoming events for landing page
 * @route   GET /api/events/featured
 */
export const getFeaturedEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({
    status: 'approved',
    date: { $gte: new Date() },
  })
    .populate('category', 'name icon')
    .populate('organizer', 'organizationName logo')
    .sort({ isFeatured: -1, date: 1 })
    .limit(8);

  res.json({ success: true, events });
});

/**
 * @desc    Get single event
 * @route   GET /api/events/:id
 */
export const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('category', 'name icon slug')
    .populate('organizer', 'organizationName logo description isVerified rating');

  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  event.views += 1;
  await event.save({ validateBeforeSave: false });

  const reviews = await Review.find({ event: event._id, isApproved: true })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(10);

  res.json({ success: true, event, reviews });
});

/**
 * @desc    Get event seats
 * @route   GET /api/events/:id/seats
 */
export const getEventSeats = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).select('seats availableSeats totalSeats ticketPricing');
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }
  res.json({ success: true, seats: event.seats, availableSeats: event.availableSeats });
});

/**
 * @desc    Get all categories
 * @route   GET /api/events/categories/all
 */
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('name');
  res.json({ success: true, categories });
});

/**
 * @desc    Get site statistics for landing page
 * @route   GET /api/events/stats
 */
export const getStats = asyncHandler(async (req, res) => {
  const Event = (await import('../models/Event.js')).default;
  const User = (await import('../models/User.js')).default;
  const Booking = (await import('../models/Booking.js')).default;

  const [totalEvents, totalUsers, totalBookings, upcomingEvents] = await Promise.all([
    Event.countDocuments({ status: 'approved' }),
    User.countDocuments({ isActive: true }),
    Booking.countDocuments({ status: 'confirmed' }),
    Event.countDocuments({ status: 'approved', date: { $gte: new Date() } }),
  ]);

  res.json({
    success: true,
    stats: { totalEvents, totalUsers, totalBookings, upcomingEvents },
  });
});

/**
 * @desc    Get events for calendar view
 * @route   GET /api/events/calendar
 */
export const getCalendarEvents = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const startDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()) - 1, 1);
  const endDate = new Date(year || new Date().getFullYear(), month || new Date().getMonth(), 0);

  const events = await Event.find({
    status: 'approved',
    date: { $gte: startDate, $lte: endDate },
  })
    .select('title date venue category images')
    .populate('category', 'name icon');

  res.json({ success: true, events });
});
