import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  shoeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shoe',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  sales: {
    type: Number,
    default: 0
  },
  advertisingCost: {
    type: Number,
    default: 0
  },
  impressions: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
analyticsSchema.index({ shoeId: 1, date: 1 });

export default mongoose.model('Analytics', analyticsSchema);