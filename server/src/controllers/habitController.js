const HabitService = require('../services/habitService');
const { ApiResponse } = require('../utils/apiResponse');

class HabitController {
  static async getHabits(req, res, next) {
    try {
      const { includeArchived, category } = req.query;
      const habits = await HabitService.getUserHabits(
        req.user._id,
        {
          includeArchived: includeArchived === 'true',
          category,
        },
        req.user.timezone
      );

      return ApiResponse.success(res, habits, 'Habits retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async createHabit(req, res, next) {
    try {
      const habit = await HabitService.createHabit(req.user._id, req.body);
      return ApiResponse.created(res, habit, 'Habit created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getHabitById(req, res, next) {
    try {
      const habit = await HabitService.getHabitById(req.params.id, req.user._id, req.user.timezone);
      return ApiResponse.success(res, habit, 'Habit retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateHabit(req, res, next) {
    try {
      const habit = await HabitService.updateHabit(req.params.id, req.user._id, req.body);
      return ApiResponse.success(res, habit, 'Habit updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async toggleArchive(req, res, next) {
    try {
      const habit = await HabitService.toggleArchive(req.params.id, req.user._id);
      const statusText = habit.archived ? 'archived' : 'restored';
      return ApiResponse.success(res, habit, `Habit ${statusText} successfully`);
    } catch (error) {
      next(error);
    }
  }

  static async deleteHabit(req, res, next) {
    try {
      await HabitService.deleteHabit(req.params.id, req.user._id);
      return ApiResponse.success(res, null, 'Habit and associated logs deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = HabitController;
