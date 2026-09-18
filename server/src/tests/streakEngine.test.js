const StreakService = require('../services/streakService');
const DateUtils = require('../utils/dateUtils');

describe('StreakForge Streak Engine Unit Tests', () => {
  const dailyHabit = {
    _id: 'habit_daily_1',
    frequency: { type: 'daily', days: [0, 1, 2, 3, 4, 5, 6] },
  };

  const mwfHabit = {
    _id: 'habit_mwf_1',
    // 1 = Mon, 3 = Wed, 5 = Fri
    frequency: { type: 'weekly', days: [1, 3, 5] },
  };

  describe('Edge Case 1: Brand new habit with no logs', () => {
    it('should return 0 current streak and 0 longest streak', () => {
      const result = StreakService.calculateStreaks(dailyHabit, [], '2026-09-18');
      expect(result).toEqual({
        currentStreak: 0,
        longestStreak: 0,
        isAtRisk: false,
        todayCompleted: false,
      });
    });
  });

  describe('Edge Case 2: Daily habit consecutive days', () => {
    it('should correctly compute streak of 5 when 5 consecutive days completed ending today', () => {
      // 2026-09-18 is Friday
      const logs = [
        '2026-09-14',
        '2026-09-15',
        '2026-09-16',
        '2026-09-17',
        '2026-09-18',
      ];
      const result = StreakService.calculateStreaks(dailyHabit, logs, '2026-09-18');
      expect(result.currentStreak).toBe(5);
      expect(result.longestStreak).toBe(5);
      expect(result.todayCompleted).toBe(true);
      expect(result.isAtRisk).toBe(false);
    });
  });

  describe('Edge Case 3: Gap days breaking streak', () => {
    it('should reset current streak when a scheduled day was missed', () => {
      // Completed Mon, Tue, Wed. Missed Thursday (2026-09-17). Completed Friday (2026-09-18).
      const logs = [
        '2026-09-14',
        '2026-09-15',
        '2026-09-16',
        '2026-09-18',
      ];
      const result = StreakService.calculateStreaks(dailyHabit, logs, '2026-09-18');
      expect(result.currentStreak).toBe(1);
      expect(result.longestStreak).toBe(3); // Mon-Wed is longest
      expect(result.todayCompleted).toBe(true);
    });
  });

  describe('Edge Case 4: Streak at risk (Today scheduled but not completed yet)', () => {
    it('should preserve streak from yesterday and flag isAtRisk as true', () => {
      // Completed Thursday (2026-09-17). Today is Friday (2026-09-18) not yet done.
      const logs = ['2026-09-16', '2026-09-17'];
      const result = StreakService.calculateStreaks(dailyHabit, logs, '2026-09-18');
      expect(result.currentStreak).toBe(2);
      expect(result.longestStreak).toBe(2);
      expect(result.todayCompleted).toBe(false);
      expect(result.isAtRisk).toBe(true);
    });

    it('should report streak 0 if yesterday was also missed', () => {
      // Completed Wednesday (2026-09-16). Missed Thursday (2026-09-17). Today is Friday (2026-09-18) not yet done.
      const logs = ['2026-09-16'];
      const result = StreakService.calculateStreaks(dailyHabit, logs, '2026-09-18');
      expect(result.currentStreak).toBe(0);
      expect(result.longestStreak).toBe(1);
      expect(result.todayCompleted).toBe(false);
      expect(result.isAtRisk).toBe(false);
    });
  });

  describe('Edge Case 5: Non-scheduled days (Custom frequency: Mon, Wed, Fri)', () => {
    it('should NOT break streak across unscheduled days (Tue, Thu, Weekends)', () => {
      // 2026-09-14 (Mon) = 1
      // 2026-09-15 (Tue) = off day
      // 2026-09-16 (Wed) = 3
      // 2026-09-17 (Thu) = off day
      // 2026-09-18 (Fri) = 5
      const logs = ['2026-09-14', '2026-09-16', '2026-09-18'];
      const result = StreakService.calculateStreaks(mwfHabit, logs, '2026-09-18');
      expect(result.currentStreak).toBe(3);
      expect(result.longestStreak).toBe(3);
      expect(result.todayCompleted).toBe(true);
    });

    it('should preserve streak on an off-day (e.g. Saturday for Mon/Wed/Fri)', () => {
      // Completed Mon, Wed, Fri. Today is Saturday (2026-09-19) which is an off day.
      const logs = ['2026-09-14', '2026-09-16', '2026-09-18'];
      const result = StreakService.calculateStreaks(mwfHabit, logs, '2026-09-19');
      // Saturday is not scheduled, so streak is active from Friday
      expect(result.currentStreak).toBe(3);
      expect(result.todayCompleted).toBe(false);
      expect(result.isAtRisk).toBe(false); // Not at risk because Saturday is an off-day!
    });

    it('should break streak if a scheduled day was missed in custom frequency', () => {
      // Completed Mon. Missed Wed (scheduled). Completed Fri.
      const logs = ['2026-09-14', '2026-09-18'];
      const result = StreakService.calculateStreaks(mwfHabit, logs, '2026-09-18');
      expect(result.currentStreak).toBe(1);
      expect(result.longestStreak).toBe(1);
    });
  });

  describe('Edge Case 6: Backfilling a past date connects disconnected chains', () => {
    it('should recalculate streak and merge chains when past date is backfilled', () => {
      // Before backfill: Mon done, Wed missing, Fri done
      const beforeLogs = ['2026-09-14', '2026-09-18'];
      const beforeResult = StreakService.calculateStreaks(mwfHabit, beforeLogs, '2026-09-18');
      expect(beforeResult.currentStreak).toBe(1);

      // Backfill Wednesday (2026-09-16)
      const afterLogs = ['2026-09-14', '2026-09-16', '2026-09-18'];
      const afterResult = StreakService.calculateStreaks(mwfHabit, afterLogs, '2026-09-18');
      expect(afterResult.currentStreak).toBe(3);
      expect(afterResult.longestStreak).toBe(3);
    });
  });

  describe('Edge Case 7: Timezone normalization and Day of Week', () => {
    it('should correctly identify day of week regardless of locale format', () => {
      // 2026-09-18 is Friday (5)
      expect(DateUtils.getDayOfWeek('2026-09-18')).toBe(5);
      // 2026-09-14 is Monday (1)
      expect(DateUtils.getDayOfWeek('2026-09-14')).toBe(1);
      // 2026-09-13 is Sunday (0)
      expect(DateUtils.getDayOfWeek('2026-09-13')).toBe(0);
    });

    it('should validate 7-day backfill boundary correctly', () => {
      const today = DateUtils.getTodayInTimezone('UTC');
      // Today is allowed
      expect(DateUtils.isAllowedCheckInDate(today, 'UTC').allowed).toBe(true);

      // 5 days ago is allowed
      const fiveDaysAgo = DateUtils.subtractDays(today, 5);
      expect(DateUtils.isAllowedCheckInDate(fiveDaysAgo, 'UTC').allowed).toBe(true);

      // 7 days ago is allowed (boundary)
      const sevenDaysAgo = DateUtils.subtractDays(today, 7);
      expect(DateUtils.isAllowedCheckInDate(sevenDaysAgo, 'UTC').allowed).toBe(true);

      // 8 days ago is rejected
      const eightDaysAgo = DateUtils.subtractDays(today, 8);
      expect(DateUtils.isAllowedCheckInDate(eightDaysAgo, 'UTC').allowed).toBe(false);

      // Future date is rejected
      expect(DateUtils.isAllowedCheckInDate('2099-01-01', 'UTC').allowed).toBe(false);
    });
  });
});
