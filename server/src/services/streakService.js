const DateUtils = require('../utils/dateUtils');
const { parseISO, format, subDays, addDays } = require('date-fns');

class StreakService {
  /**
   * Determine if a given date string is a scheduled day for the habit
   */
  static isScheduledDay(dateStr, frequency) {
    if (!frequency || frequency.type === 'daily') {
      return true;
    }
    const dayOfWeek = DateUtils.getDayOfWeek(dateStr);
    const scheduledDays = Array.isArray(frequency.days) ? frequency.days : [0, 1, 2, 3, 4, 5, 6];
    return scheduledDays.includes(dayOfWeek);
  }

  /**
   * Calculate Current Streak & Longest Streak
   * @param {Object} habit - Habit model or object { frequency, createdAt }
   * @param {Array<string>} completedDateStrings - Array of 'YYYY-MM-DD' dates completed
   * @param {string} userToday - 'YYYY-MM-DD' representing today in user's local timezone
   */
  static calculateStreaks(habit, completedDateStrings, userToday) {
    const completedSet = new Set(completedDateStrings || []);

    if (completedSet.size === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        isAtRisk: false,
        todayCompleted: false,
      };
    }

    const frequency = habit.frequency || { type: 'daily', days: [0, 1, 2, 3, 4, 5, 6] };
    const isTodayScheduled = this.isScheduledDay(userToday, frequency);
    const isTodayCompleted = completedSet.has(userToday);

    // 1. Calculate Current Streak
    let currentStreak = 0;
    let isAtRisk = false;

    let checkDateStr;

    if (isTodayScheduled) {
      if (isTodayCompleted) {
        currentStreak = 1;
        checkDateStr = DateUtils.subtractDays(userToday, 1);
      } else {
        // Today is scheduled but not completed yet
        isAtRisk = true;
        checkDateStr = DateUtils.subtractDays(userToday, 1);
      }
    } else {
      // Today is not a scheduled day (off day)
      checkDateStr = DateUtils.subtractDays(userToday, 1);
    }

    // Walk backward day by day
    // Safety cap: max 1000 days
    let daysChecked = 0;
    while (daysChecked < 1000) {
      const scheduled = this.isScheduledDay(checkDateStr, frequency);

      if (scheduled) {
        if (completedSet.has(checkDateStr)) {
          currentStreak++;
        } else {
          // Missed scheduled day -> streak stops
          break;
        }
      }
      // Non-scheduled days are skipped without breaking streak!
      checkDateStr = DateUtils.subtractDays(checkDateStr, 1);
      daysChecked++;
    }

    // 2. Calculate Longest Streak Across All Time
    // Sort all completed dates
    const sortedCompleted = Array.from(completedSet).sort();
    let longestStreak = 0;

    if (sortedCompleted.length > 0) {
      const earliestDateStr = sortedCompleted[0];
      let runningStreak = 0;
      let iterDate = parseISO(earliestDateStr);
      const endDate = parseISO(userToday);

      while (iterDate <= endDate) {
        const iterDateStr = format(iterDate, 'yyyy-MM-dd');
        const scheduled = this.isScheduledDay(iterDateStr, frequency);

        if (scheduled) {
          if (completedSet.has(iterDateStr)) {
            runningStreak++;
            if (runningStreak > longestStreak) {
              longestStreak = runningStreak;
            }
          } else {
            runningStreak = 0;
          }
        }
        iterDate = addDays(iterDate, 1);
      }
    }

    // Longest streak cannot be less than current streak
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    return {
      currentStreak,
      longestStreak,
      isAtRisk: isAtRisk && currentStreak > 0,
      todayCompleted: isTodayCompleted,
    };
  }
}

module.exports = StreakService;
