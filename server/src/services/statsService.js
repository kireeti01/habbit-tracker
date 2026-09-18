const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const DateUtils = require('../utils/dateUtils');
const StreakService = require('./streakService');
const { format, subDays, parseISO, eachDayOfInterval } = require('date-fns');

class StatsService {
  /**
   * Get high-level overview statistics
   */
  static async getOverview(userId, userTimezone = 'UTC') {
    const habits = await Habit.find({ userId, archived: false });
    const userToday = DateUtils.getTodayInTimezone(userTimezone);

    const totalHabits = habits.length;
    let activeStreaks = 0;
    let bestStreak = 0;
    let todayTotalScheduled = 0;

    habits.forEach((h) => {
      if (h.currentStreak > 0) activeStreaks++;
      if (h.longestStreak > bestStreak) bestStreak = h.longestStreak;
      if (StreakService.isScheduledDay(userToday, h.frequency)) {
        todayTotalScheduled++;
      }
    });

    // Today's completed count
    const todayLogs = await HabitLog.find({
      userId,
      date: userToday,
      completed: true,
    });
    const todayCompletedCount = todayLogs.length;

    // 7-day and 30-day completion rates
    const startDate30d = DateUtils.subtractDays(userToday, 30);
    const startDate7d = DateUtils.subtractDays(userToday, 7);

    const logsLast30d = await HabitLog.find({
      userId,
      date: { $gte: startDate30d, $lte: userToday },
      completed: true,
    });

    const logsLast7d = logsLast30d.filter((l) => l.date >= startDate7d);

    // Calculate total scheduled slots in 7d and 30d
    let scheduledSlots7d = 0;
    let scheduledSlots30d = 0;

    const todayDate = parseISO(userToday);
    for (let i = 0; i <= 30; i++) {
      const d = subDays(todayDate, i);
      const dStr = format(d, 'yyyy-MM-dd');
      habits.forEach((h) => {
        if (StreakService.isScheduledDay(dStr, h.frequency)) {
          scheduledSlots30d++;
          if (i <= 7) {
            scheduledSlots7d++;
          }
        }
      });
    }

    const completionRate7d =
      scheduledSlots7d > 0 ? Math.round((logsLast7d.length / scheduledSlots7d) * 100) : 0;
    const completionRate30d =
      scheduledSlots30d > 0 ? Math.round((logsLast30d.length / scheduledSlots30d) * 100) : 0;

    return {
      totalHabits,
      activeStreaks,
      bestStreak,
      todayTotalScheduled,
      todayCompletedCount,
      completionRate7d: Math.min(100, completionRate7d),
      completionRate30d: Math.min(100, completionRate30d),
    };
  }

  /**
   * Get 365-day heatmap data for a habit
   */
  static async getHeatmap(habitId, userId, userTimezone = 'UTC') {
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      throw new Error('Habit not found');
    }

    const userToday = DateUtils.getTodayInTimezone(userTimezone);
    const startDateStr = DateUtils.subtractDays(userToday, 364);

    const logs = await HabitLog.find({
      habitId,
      userId,
      date: { $gte: startDateStr, $lte: userToday },
      completed: true,
    });

    const logMap = new Map();
    logs.forEach((l) => {
      logMap.set(l.date, l.note || '');
    });

    // Generate continuous 365-day array
    const todayDate = parseISO(userToday);
    const startDate = parseISO(startDateStr);
    const allDays = eachDayOfInterval({ start: startDate, end: todayDate });

    const heatmap = allDays.map((d) => {
      const dateStr = format(d, 'yyyy-MM-dd');
      const isScheduled = StreakService.isScheduledDay(dateStr, habit.frequency);
      const isCompleted = logMap.has(dateStr);

      return {
        date: dateStr,
        dayOfWeek: d.getDay(),
        scheduled: isScheduled,
        completed: isCompleted,
        note: logMap.get(dateStr) || '',
        count: isCompleted ? 1 : 0,
      };
    });

    return {
      habit: {
        _id: habit._id,
        title: habit.title,
        color: habit.color,
        icon: habit.icon,
        currentStreak: habit.currentStreak,
        longestStreak: habit.longestStreak,
      },
      heatmap,
    };
  }

  /**
   * Get weekly chart data for Recharts
   */
  static async getWeeklyChart(userId, userTimezone = 'UTC') {
    const habits = await Habit.find({ userId, archived: false });
    const userToday = DateUtils.getTodayInTimezone(userTimezone);
    const todayDate = parseISO(userToday);

    // Last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = subDays(todayDate, i);
      const dStr = format(d, 'yyyy-MM-dd');
      const dayName = format(d, 'EEE');

      let scheduledCount = 0;
      habits.forEach((h) => {
        if (StreakService.isScheduledDay(dStr, h.frequency)) {
          scheduledCount++;
        }
      });

      days.push({
        date: dStr,
        dayName,
        scheduled: scheduledCount,
        completed: 0,
      });
    }

    const startDate = days[0].date;
    const endDate = days[days.length - 1].date;

    const logs = await HabitLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
      completed: true,
    });

    const countsByDate = {};
    logs.forEach((l) => {
      countsByDate[l.date] = (countsByDate[l.date] || 0) + 1;
    });

    const weeklyData = days.map((day) => {
      const completed = countsByDate[day.date] || 0;
      const rate = day.scheduled > 0 ? Math.round((completed / day.scheduled) * 100) : 0;
      return {
        ...day,
        completed,
        rate: Math.min(100, rate),
      };
    });

    return weeklyData;
  }
}

module.exports = StatsService;
