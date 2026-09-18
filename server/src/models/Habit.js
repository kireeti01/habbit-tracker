const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Habit title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    category: {
      type: String,
      enum: ['health', 'study', 'fitness', 'mindfulness', 'work', 'other'],
      default: 'other',
      index: true,
    },
    color: {
      type: String,
      default: '#6366F1', // Indigo
    },
    icon: {
      type: String,
      default: '⚡',
    },
    frequency: {
      type: {
        type: String,
        enum: ['daily', 'weekly'],
        default: 'daily',
      },
      days: {
        type: [Number], // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        default: [0, 1, 2, 3, 4, 5, 6],
      },
    },
    targetTime: {
      type: String,
      default: '', // e.g. "08:00"
    },
    reminder: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
      index: true,
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user habit listing
habitSchema.index({ userId: 1, archived: 1, category: 1 });

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;
