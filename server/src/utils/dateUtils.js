const { format, subDays, parseISO, isAfter, isBefore, startOfDay } = require('date-fns');

class DateUtils {
  /**
   * Get today's date string (YYYY-MM-DD) in a specific timezone
   */
  static getTodayInTimezone(timezone = 'UTC') {
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone || 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      return formatter.format(now); // en-CA produces YYYY-MM-DD
    } catch (e) {
      // Fallback to UTC
      return format(new Date(), 'yyyy-MM-dd');
    }
  }

  /**
   * Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
   */
  static getDayOfWeek(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    // Note: month is 0-indexed in JS Date constructor
    const date = new Date(year, month - 1, day);
    return date.getDay();
  }

  /**
   * Validate if a date is within allowed check-in range (last 7 days up to today)
   */
  static isAllowedCheckInDate(targetDateStr, timezone = 'UTC') {
    const todayStr = this.getTodayInTimezone(timezone);
    if (targetDateStr > todayStr) {
      return { allowed: false, reason: 'Cannot log habits for future dates.' };
    }

    const todayDate = parseISO(todayStr);
    const minAllowedDate = subDays(todayDate, 7);
    const minAllowedStr = format(minAllowedDate, 'yyyy-MM-dd');

    if (targetDateStr < minAllowedStr) {
      return {
        allowed: false,
        reason: `Check-in date is older than allowed 7-day backfill window (${minAllowedStr} to ${todayStr}).`,
      };
    }

    return { allowed: true };
  }

  /**
   * Subtract N days from YYYY-MM-DD
   */
  static subtractDays(dateStr, days) {
    const parsed = parseISO(dateStr);
    const result = subDays(parsed, days);
    return format(result, 'yyyy-MM-dd');
  }
}

module.exports = DateUtils;
