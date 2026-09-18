const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const StreakService = require('./streakService');
const DateUtils = require('../utils/dateUtils');
const { AppError } = require('../utils/apiResponse');

class HabitService {
  /**
   * Create a new habit
   */
  static async createHabit(userId, habitData) {
    const habit = await Habit.create({
      ...habitData,
      userId,
    });
    return habit;
  }

  /**
   * Get all habits for user with current streak stats
   */
  static async getUserHabits(userId, { includeArchived = false, category = null } = {}, userTimezone = 'UTC') {
    const query = { userId };
    if (!includeArchived) {
      query.archived = false;
    }
    if (category && category !== 'all') {
      query.category = category;
    }

    const habits = await Habit.find(query).sort({ createdAt: -1 });
    const userToday = DateUtils.getTodayInTimezone(userTimezone);

    // Populate today's check-in status and active streak info
    const habitIds = habits.map((h) => h._id);
    const todayLogs = await HabitLog.find({
      userId,
      habitId: { $in: habitIds },
      date: userToday,
      completed: true,
    });

    const todayCompletedSet = new Set(todayLogs.map((l) => l.habitId.toString()));

    const enrichedHabits = habits.map((h) => {
      const habitObj = h.toObject();
      const isTodayScheduled = StreakService.isScheduledDay(userToday, h.frequency);
      const isTodayCompleted = todayCompletedSet.has(h._id.toString());

      return {
        ...habitObj,
        todayScheduled: isTodayScheduled,
        todayCompleted: isTodayCompleted,
        isAtRisk: isTodayScheduled && !isTodayCompleted && h.currentStreak > 0,
      };
    });

    return enrichedHabits;
  }

  /**
   * Get single habit by ID
   */
  static async getHabitById(habitId, userId, userTimezone = 'UTC') {
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      throw new AppError('Habit not found', 404);
    }

    const userToday = DateUtils.getTodayInTimezone(userTimezone);
    const logs = await HabitLog.find({ habitId, completed: true }).select('date');
    const completedDates = logs.map((l) => l.date);

    const streaks = StreakService.calculateStreaks(habit, completedDates, userToday);

    // Sync database if cached streak diverged
    if (habit.currentStreak !== streaks.currentStreak || habit.longestStreak !== streaks.longestStreak) {
      habit.currentStreak = streaks.currentStreak;
      habit.longestStreak = streaks.longestStreak;
      await habit.save();
    }

    return {
      ...habit.toObject(),
      ...streaks,
    };
  }

  /**
   * Update habit
   */
  static async updateHabit(habitId, userId, updateData) {
    const habit = await Habit.findOneAndUpdate(
      { _id: habitId, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!habit) {
      throw new AppError('Habit not found', 404);
    }
    return habit;
  }

  /**
   * Toggle archive/restore status
   */
  static async toggleArchive(habitId, userId) {
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      throw new AppError('Habit not found', 404);
    }

    habit.archived = !habit.archived;
    await habit.save();
    return habit;
  }

  /**
   * Delete habit and all associated logs
   */
  static async deleteHabit(habitId, userId) {
    const habit = await Habit.findOneAndDelete({ _id: habitId, userId });
    if (!habit) {
      throw new AppError('Habit not found', 404);
    }

    await HabitLog.deleteMany({ habitId, userId });
    return { deletedHabitId: habitId };
  }

  /**
   * Toggle or set check-in for a given date
   */
  static async toggleCheckIn(habitId, userId, { date, completed, note }, userTimezone = 'UTC') {
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      throw new AppError('Habit not found', 404);
    }

    // Validate 7-day backfill window
    const checkValidation = DateUtils.isAllowedCheckInDate(date, userTimezone);
    if (!checkValidation.allowed) {
      throw new AppError(checkValidation.reason, 400);
    }

    // Find existing log for this date
    let log = await HabitLog.findOne({ habitId, date, userId });

    if (log) {
      // Toggle or explicitly set
      log.completed = completed !== undefined ? completed : !log.completed;
      if (note !== undefined) log.note = note;
      await log.save();
    } else {
      // Create new completed log
      log = await HabitLog.create({
        userId,
        habitId,
        date,
        completed: completed !== undefined ? completed : true,
        note: note || '',
      });
    }

    // Recalculate streaks for habit
    const completedLogs = await HabitLog.find({ habitId, completed: true }).select('date');
    const completedDates = completedLogs.map((l) => l.date);
    const userToday = DateUtils.getTodayInTimezone(userTimezone);

    const streaks = StreakService.calculateStreaks(habit, completedDates, userToday);

    habit.currentStreak = streaks.currentStreak;
    habit.longestStreak = streaks.longestStreak;
    await habit.save();

    return {
      log,
      habit,
      streaks,
    };
  }

  /**
   * Get logs for habit within date range
   */
  static async getHabitLogs(habitId, userId, { from, to }) {
    const query = { habitId, userId };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = from;
      if (to) query.date.$lte = to;
    }

    const logs = await HabitLog.find(query).sort({ date: -1 });
    return logs;
  }
}

module.exports = HabitService;
