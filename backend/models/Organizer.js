import mongoose from 'mongoose';

const organizerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    organizationName: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    description: String,
    logo: String,
    website: String,
    phone: String,
    address: String,
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    totalEvents: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Organizer', organizerSchema);
