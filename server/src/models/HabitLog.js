const mongoose = require('mongoose');

const habitLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
      index: true,
    },
    date: {
      type: String, // 'YYYY-MM-DD'
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'],
    },
    completed: {
      type: Boolean,
      default: true,
    },
    note: {
      type: String,
      maxlength: [300, 'Note cannot exceed 300 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// One log per habit per date strictly enforced
habitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

// Fast querying by user and date
habitLogSchema.index({ userId: 1, date: 1 });
habitLogSchema.index({ userId: 1, habitId: 1, date: 1 });

const HabitLog = mongoose.model('HabitLog', habitLogSchema);

module.exports = HabitLog;
