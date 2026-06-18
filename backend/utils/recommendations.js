import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

/**
 * AI-powered event recommendations based on user history and preferences
 */
export const getEventRecommendations = async (userId, limit = 6) => {
  const user = await User.findById(userId).populate('savedEvents');
  const userBookings = await Booking.find({ user: userId }).populate('event');
  const attendedCategories = new Set();
  const attendedTags = new Set();

  userBookings.forEach((booking) => {
    if (booking.event?.category) attendedCategories.add(booking.event.category.toString());
    booking.event?.tags?.forEach((tag) => attendedTags.add(tag));
  });

  user?.savedEvents?.forEach((event) => {
    if (event.category) attendedCategories.add(event.category.toString());
    event.tags?.forEach((tag) => attendedTags.add(tag));
  });

  const query = {
    status: 'approved',
    date: { $gte: new Date() },
  };

  let recommendations = await Event.find(query)
    .populate('category', 'name icon')
    .populate('organizer', 'organizationName logo')
    .sort({ averageRating: -1, totalBookings: -1 })
    .limit(limit * 2);

  // Score and rank events
  const scored = recommendations.map((event) => {
    let score = event.averageRating * 2 + event.totalBookings * 0.1;
    if (attendedCategories.has(event.category?._id?.toString())) score += 5;
    event.tags?.forEach((tag) => {
      if (attendedTags.has(tag)) score += 2;
    });
    if (event.isFeatured) score += 3;
    return { event, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.event);
};
