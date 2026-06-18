import Notification from '../models/Notification.js';

/**
 * Create and optionally emit real-time notification
 */
export const createNotification = async (io, { userId, title, message, type = 'system', link, metadata }) => {
  const notification = await Notification.create({
    user: userId,
    title,
    message,
    type,
    link,
    metadata,
  });

  if (io) {
    io.to(`user_${userId}`).emit('notification', notification);
  }

  return notification;
};

/**
 * Mark notifications as read
 */
export const markAsRead = async (userId, notificationIds = null) => {
  const filter = { user: userId, isRead: false };
  if (notificationIds) filter._id = { $in: notificationIds };

  return await Notification.updateMany(filter, { isRead: true });
};
