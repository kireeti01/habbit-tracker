const AIService = require('../services/aiService');
const { ApiResponse } = require('../utils/apiResponse');

class AIController {
  static async suggestHabits(req, res, next) {
    try {
      const { goal } = req.body;
      const suggestions = await AIService.suggestHabits(goal);
      return ApiResponse.success(res, suggestions, 'Habit suggestions generated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getWeeklyInsight(req, res, next) {
    try {
      const force = req.query.force === 'true';
      const insight = await AIService.getWeeklyInsight(req.user._id, req.user.timezone, force);
      return ApiResponse.success(res, insight, 'Weekly insight generated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getMotivation(req, res, next) {
    try {
      const { habitId } = req.body;
      const motivation = await AIService.getMotivation(habitId, req.user._id);
      return ApiResponse.success(res, motivation, 'Motivation generated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async chat(req, res, next) {
    try {
      const { message, conversationHistory } = req.body;
      const reply = await AIService.chatWithCoach(
        req.user._id,
        message,
        conversationHistory,
        req.user.timezone
      );
      return ApiResponse.success(res, { reply }, 'Coach response received');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AIController;
