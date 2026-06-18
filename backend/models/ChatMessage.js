import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: { type: String, required: true, maxlength: 2000 },
    isFromSupport: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
    sessionId: { type: String, required: true },
  },
  { timestamps: true }
);

chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

export default mongoose.model('ChatMessage', chatMessageSchema);
