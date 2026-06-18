import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  row: String,
  number: Number,
  type: { type: String, enum: ['regular', 'vip', 'premium'], default: 'regular' },
  price: Number,
  isBooked: { type: Boolean, default: false },
});

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    images: [{ type: String }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organizer',
      required: true,
    },
    date: { type: Date, required: [true, 'Event date is required'] },
    endDate: Date,
    venue: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: String,
      state: String,
      country: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    ticketPricing: {
      regular: { type: Number, required: true, min: 0 },
      vip: { type: Number, default: 0 },
      premium: { type: Number, default: 0 },
    },
    totalSeats: { type: Number, required: true, min: 1 },
    availableSeats: { type: Number, required: true, min: 0 },
    seats: [seatSchema],
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
    rejectionReason: String,
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

eventSchema.index({ title: 'text', description: 'text', tags: 'text' });
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ category: 1 });

export default mongoose.model('Event', eventSchema);
