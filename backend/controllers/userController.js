import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getEventRecommendations } from '../utils/recommendations.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('savedEvents', 'title images date venue status')
    .populate('wishlist', 'title images date venue ticketPricing');
  res.json({ success: true, user });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar, preferences } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phone, avatar, preferences },
    { new: true, runValidators: true }
  );
  res.json({ success: true, user });
});

/**
 * @desc    Get user bookings
 * @route   GET /api/users/bookings
 */
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate('event', 'title images date venue status')
    .populate('payment', 'status amount provider')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: bookings.length, bookings });
});

/**
 * @desc    Get booking history (completed events)
 * @route   GET /api/users/history
 */
export const getEventHistory = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    user: req.user.id,
    status: { $in: ['confirmed', 'used'] },
  })
    .populate({
      path: 'event',
      match: { date: { $lt: new Date() } },
      select: 'title images date venue',
    })
    .sort({ createdAt: -1 });

  const history = bookings.filter((b) => b.event);
  res.json({ success: true, count: history.length, history });
});

/**
 * @desc    Get user notifications
 * @route   GET /api/users/notifications
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50);
  const unreadCount = await Notification.countDocuments({ user: req.user.id, isRead: false });
  res.json({ success: true, unreadCount, notifications });
});

/**
 * @desc    Mark notifications as read
 * @route   PUT /api/users/notifications/read
 */
export const markNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user.id, isRead: false },
    { isRead: true }
  );
  res.json({ success: true, message: 'Notifications marked as read' });
});

/**
 * @desc    Toggle saved event
 * @route   POST /api/users/saved-events/:eventId
 */
export const toggleSavedEvent = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const eventId = req.params.eventId;
  const index = user.savedEvents.indexOf(eventId);

  if (index > -1) {
    user.savedEvents.splice(index, 1);
  } else {
    user.savedEvents.push(eventId);
  }

  await user.save();
  res.json({ success: true, saved: index === -1, savedEvents: user.savedEvents });
});

/**
 * @desc    Toggle wishlist
 * @route   POST /api/users/wishlist/:eventId
 */
export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const eventId = req.params.eventId;
  const index = user.wishlist.indexOf(eventId);

  if (index > -1) {
    user.wishlist.splice(index, 1);
  } else {
    user.wishlist.push(eventId);
  }

  await user.save();
  res.json({ success: true, inWishlist: index === -1, wishlist: user.wishlist });
});

/**
 * @desc    Get AI event recommendations
 * @route   GET /api/users/recommendations
 */
export const getRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await getEventRecommendations(req.user.id);
  res.json({ success: true, recommendations });
});
