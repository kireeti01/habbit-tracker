const mongoose = require('mongoose');

const aiInsightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['weekly', 'motivation', 'chat'],
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly find recent cached insights
aiInsightSchema.index({ userId: 1, type: 1, generatedAt: -1 });

const AIInsight = mongoose.model('AIInsight', aiInsightSchema);

module.exports = AIInsight;
