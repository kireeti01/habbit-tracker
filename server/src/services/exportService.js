const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');

class ExportService {
  /**
   * Export all user data as JSON
   */
  static async exportJSON(user) {
    const habits = await Habit.find({ userId: user._id });
    const logs = await HabitLog.find({ userId: user._id }).sort({ date: -1 });

    const exportData = {
      app: 'StreakForge',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        timezone: user.timezone,
      },
      habits: habits.map((h) => ({
        id: h._id,
        title: h.title,
        description: h.description,
        category: h.category,
        frequency: h.frequency,
        currentStreak: h.currentStreak,
        longestStreak: h.longestStreak,
        archived: h.archived,
        createdAt: h.createdAt,
      })),
      logs: logs.map((l) => ({
        id: l._id,
        habitId: l.habitId,
        date: l.date,
        completed: l.completed,
        note: l.note,
      })),
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Export all user logs as CSV
   */
  static async exportCSV(user) {
    const habits = await Habit.find({ userId: user._id });
    const habitMap = new Map();
    habits.forEach((h) => {
      habitMap.set(h._id.toString(), h);
    });

    const logs = await HabitLog.find({ userId: user._id }).sort({ date: -1 });

    // CSV Header
    const rows = [
      ['Date', 'Habit Title', 'Category', 'Status', 'Frequency', 'Note', 'Habit ID'].join(','),
    ];

    logs.forEach((log) => {
      const habit = habitMap.get(log.habitId.toString());
      const habitTitle = habit ? `"${habit.title.replace(/"/g, '""')}"` : 'Unknown';
      const category = habit ? habit.category : 'other';
      const frequency = habit ? habit.frequency?.type || 'daily' : 'daily';
      const status = log.completed ? 'Completed' : 'Missed';
      const note = `"${(log.note || '').replace(/"/g, '""')}"`;

      rows.push([log.date, habitTitle, category, status, frequency, note, log.habitId].join(','));
    });

    return rows.join('\n');
  }
}

module.exports = ExportService;
