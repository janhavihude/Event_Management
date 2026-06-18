import Review from '../models/Review.js';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import Report from '../models/Report.js';
import ChatMessage from '../models/ChatMessage.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * @desc    Create review
 * @route   POST /api/reviews
 */
export const createReview = asyncHandler(async (req, res) => {
  const { eventId, rating, comment } = req.body;

  const booking = await Booking.findOne({
    user: req.user.id,
    event: eventId,
    status: { $in: ['confirmed', 'used'] },
  });

  if (!booking) {
    return res.status(400).json({ success: false, message: 'You must attend the event to review it' });
  }

  const review = await Review.create({
    user: req.user.id,
    event: eventId,
    rating,
    comment,
  });

  const stats = await Review.aggregate([
    { $match: { event: review.event } },
    { $group: { _id: '$event', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats.length) {
    await Event.findByIdAndUpdate(eventId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      totalReviews: stats[0].count,
    });
  }

  await review.populate('user', 'name avatar');
  res.status(201).json({ success: true, review });
});

/**
 * @desc    Get event reviews
 * @route   GET /api/reviews/event/:eventId
 */
export const getEventReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ event: req.params.eventId, isApproved: true })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
  res.json({ success: true, reviews });
});

/**
 * @desc    Submit report
 * @route   POST /api/reports
 */
export const createReport = asyncHandler(async (req, res) => {
  const report = await Report.create({ ...req.body, reportedBy: req.user.id });
  res.status(201).json({ success: true, report });
});

/**
 * @desc    Get chat messages
 * @route   GET /api/chat/:sessionId
 */
export const getChatMessages = asyncHandler(async (req, res) => {
  const messages = await ChatMessage.find({ sessionId: req.params.sessionId })
    .populate('user', 'name avatar')
    .sort({ createdAt: 1 });
  res.json({ success: true, messages });
});

/**
 * @desc    Send chat message
 * @route   POST /api/chat
 */
export const sendChatMessage = asyncHandler(async (req, res) => {
  const { message, sessionId } = req.body;

  const chatMessage = await ChatMessage.create({
    user: req.user.id,
    message,
    sessionId: sessionId || `chat_${req.user.id}`,
  });

  const io = req.app.get('io');
  if (io) {
    io.to(sessionId || `chat_${req.user.id}`).emit('chat_message', chatMessage);
  }

  await chatMessage.populate('user', 'name avatar');
  res.status(201).json({ success: true, message: chatMessage });
});

/**
 * @desc    Contact form submission
 * @route   POST /api/contact
 */
export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log(`[CONTACT] From: ${name} <${email}> | Subject: ${subject} | Message: ${message}`);
  res.json({ success: true, message: 'Thank you for contacting us. We will get back to you soon!' });
});
