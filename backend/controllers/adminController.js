import User from '../models/User.js';
import Event from '../models/Event.js';
import Organizer from '../models/Organizer.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import Report from '../models/Report.js';
import Category from '../models/Category.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { createNotification } from '../utils/notification.js';

/**
 * @desc    Get admin dashboard analytics
 * @route   GET /api/admin/dashboard
 */
export const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalOrganizers,
    totalEvents,
    pendingEvents,
    totalBookings,
    totalRevenue,
    recentBookings,
  ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Organizer.countDocuments(),
    Event.countDocuments(),
    Event.countDocuments({ status: 'pending' }),
    Booking.countDocuments({ status: 'confirmed' }),
    Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Booking.find()
      .populate('user', 'name')
      .populate('event', 'title')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalOrganizers,
      totalEvents,
      pendingEvents,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
    recentBookings,
  });
});

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 */
export const getUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];
  }

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await User.countDocuments(query);
  res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
});

/**
 * @desc    Update user (activate/deactivate/change role)
 * @route   PUT /api/admin/users/:id
 */
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({ success: true, user });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  if (user.role === 'admin') {
    return res.status(403).json({ success: false, message: 'Cannot delete admin user' });
  }
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted' });
});

/**
 * @desc    Get all organizers
 * @route   GET /api/admin/organizers
 */
export const getOrganizers = asyncHandler(async (req, res) => {
  const organizers = await Organizer.find()
    .populate('user', 'name email avatar isActive')
    .sort({ createdAt: -1 });
  res.json({ success: true, organizers });
});

/**
 * @desc    Approve/reject organizer
 * @route   PUT /api/admin/organizers/:id
 */
export const updateOrganizer = asyncHandler(async (req, res) => {
  const organizer = await Organizer.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate('user', 'name email');

  if (!organizer) {
    return res.status(404).json({ success: false, message: 'Organizer not found' });
  }

  const io = req.app.get('io');
  await createNotification(io, {
    userId: organizer.user._id,
    title: req.body.isApproved ? 'Organizer Approved' : 'Organizer Application Update',
    message: req.body.isApproved
      ? 'Your organizer account has been approved!'
      : 'Your organizer application needs review.',
    type: 'system',
  });

  res.json({ success: true, organizer });
});

/**
 * @desc    Get pending events for approval
 * @route   GET /api/admin/events/pending
 */
export const getPendingEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ status: 'pending' })
    .populate('category', 'name')
    .populate('organizer', 'organizationName')
    .sort({ createdAt: -1 });
  res.json({ success: true, events });
});

/**
 * @desc    Approve/reject event
 * @route   PUT /api/admin/events/:id/status
 */
export const updateEventStatus = asyncHandler(async (req, res) => {
  const { status, rejectionReason } = req.body;
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { status, rejectionReason },
    { new: true }
  ).populate('organizer');

  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  const organizer = await Organizer.findById(event.organizer._id);
  if (organizer) {
    const io = req.app.get('io');
    await createNotification(io, {
      userId: organizer.user,
      title: status === 'approved' ? 'Event Approved!' : 'Event Rejected',
      message:
        status === 'approved'
          ? `Your event "${event.title}" has been approved and is now live.`
          : `Your event "${event.title}" was rejected. Reason: ${rejectionReason || 'Not specified'}`,
      type: 'event',
      link: `/organizer/events/${event._id}`,
    });
  }

  res.json({ success: true, event });
});

/**
 * @desc    Get all reports
 * @route   GET /api/admin/reports
 */
export const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find()
    .populate('reportedBy', 'name email')
    .populate('resolvedBy', 'name')
    .sort({ createdAt: -1 });
  res.json({ success: true, reports });
});

/**
 * @desc    Resolve report
 * @route   PUT /api/admin/reports/:id
 */
export const resolveReport = asyncHandler(async (req, res) => {
  const report = await Report.findByIdAndUpdate(
    req.params.id,
    { ...req.body, resolvedBy: req.user.id },
    { new: true }
  );
  res.json({ success: true, report });
});

/**
 * @desc    Manage categories
 * @route   POST /api/admin/categories
 */
export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
});

/**
 * @desc    Get site analytics
 * @route   GET /api/admin/analytics
 */
export const getAnalytics = asyncHandler(async (req, res) => {
  const monthlyBookings = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) },
        status: 'confirmed',
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const categoryStats = await Event.aggregate([
    { $match: { status: 'approved' } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
    { $unwind: '$category' },
    { $project: { name: '$category.name', count: 1 } },
  ]);

  res.json({ success: true, monthlyBookings, categoryStats });
});

/**
 * @desc    System settings - get all events
 * @route   GET /api/admin/events
 */
export const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find()
    .populate('category', 'name')
    .populate('organizer', 'organizationName')
    .sort({ createdAt: -1 });
  res.json({ success: true, events });
});
