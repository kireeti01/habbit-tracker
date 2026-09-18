const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ExportService = require('../services/exportService');
const { ApiResponse, AppError } = require('../utils/apiResponse');

class UserController {
  static async updateProfile(req, res, next) {
    try {
      const { name, timezone, theme } = req.body;
      const updates = {};
      if (name) updates.name = name;
      if (timezone) updates.timezone = timezone;
      if (theme) updates.theme = theme;

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      return ApiResponse.success(res, { user }, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updatePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id);

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        throw new AppError('Current password does not match.', 400);
      }

      const salt = await bcrypt.genSalt(12);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
      await user.save();

      return ApiResponse.success(res, null, 'Password changed successfully');
    } catch (error) {
      next(error);
    }
  }

  static async exportData(req, res, next) {
    try {
      const format = (req.query.format || 'json').toLowerCase();
      const dateStr = new Date().toISOString().split('T')[0];

      if (format === 'csv') {
        const csvContent = await ExportService.exportCSV(req.user);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="streakforge-data-${dateStr}.csv"`
        );
        return res.status(200).send(csvContent);
      }

      // Default JSON
      const jsonContent = await ExportService.exportJSON(req.user);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="streakforge-data-${dateStr}.json"`
      );
      return res.status(200).send(jsonContent);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
