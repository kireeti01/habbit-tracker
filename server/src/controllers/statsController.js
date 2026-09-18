const StatsService = require('../services/statsService');
const { ApiResponse } = require('../utils/apiResponse');

class StatsController {
  static async getOverview(req, res, next) {
    try {
      const stats = await StatsService.getOverview(req.user._id, req.user.timezone);
      return ApiResponse.success(res, stats, 'Overview statistics retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getHeatmap(req, res, next) {
    try {
      const { habitId } = req.params;
      const data = await StatsService.getHeatmap(habitId, req.user._id, req.user.timezone);
      return ApiResponse.success(res, data, 'Heatmap data retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getWeekly(req, res, next) {
    try {
      const data = await StatsService.getWeeklyChart(req.user._id, req.user.timezone);
      return ApiResponse.success(res, data, 'Weekly chart data retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StatsController;
