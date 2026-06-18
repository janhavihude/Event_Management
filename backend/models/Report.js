import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['event', 'user', 'review', 'organizer', 'other'],
      required: true,
    },
    targetId: mongoose.Schema.Types.ObjectId,
    targetModel: {
      type: String,
      enum: ['Event', 'User', 'Review', 'Organizer'],
    },
    reason: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'resolved', 'dismissed'],
      default: 'pending',
    },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolution: String,
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
