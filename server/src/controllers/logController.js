const HabitService = require('../services/habitService');
const { ApiResponse } = require('../utils/apiResponse');

class LogController {
  static async checkIn(req, res, next) {
    try {
      const { id } = req.params;
      const { date, completed, note } = req.body;

      const result = await HabitService.toggleCheckIn(
        id,
        req.user._id,
        { date, completed, note },
        req.user.timezone
      );

      return ApiResponse.success(
        res,
        result,
        result.log.completed ? 'Habit completed for date' : 'Habit unchecked for date'
      );
    } catch (error) {
      next(error);
    }
  }

  static async getLogs(req, res, next) {
    try {
      const { id } = req.params;
      const { from, to } = req.query;

      const logs = await HabitService.getHabitLogs(id, req.user._id, { from, to });
      return ApiResponse.success(res, logs, 'Habit logs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LogController;
