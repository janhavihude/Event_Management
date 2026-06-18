import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    seats: [
      {
        row: String,
        number: Number,
        type: { type: String, enum: ['regular', 'vip', 'premium'] },
        price: Number,
      },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    ticketCount: { type: Number, required: true, min: 1 },
    bookingReference: { type: String, unique: true, required: true },
    qrCode: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'refunded', 'used'],
      default: 'pending',
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: Date,
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ event: 1 });
bookingSchema.index({ bookingReference: 1 });

export default mongoose.model('Booking', bookingSchema);
