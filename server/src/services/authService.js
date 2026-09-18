const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const env = require('../config/env');
const { AppError } = require('../utils/apiResponse');

class AuthService {
  /**
   * Generate Short-Lived Access Token (15m)
   */
  static generateAccessToken(user) {
    return jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRY }
    );
  }

  /**
   * Generate Long-Lived Refresh Token (7d)
   */
  static generateRefreshToken(user) {
    return jwt.sign(
      {
        userId: user._id.toString(),
      },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRY }
    );
  }

  /**
   * Register a new user
   */
  static async register({ name, email, password, timezone }) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError('An account with this email already exists', 409);
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      timezone: timezone || 'UTC',
    });

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { user, accessToken, refreshToken };
  }

  /**
   * Login user with credentials
   */
  static async login(email, password) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { user, accessToken, refreshToken };
  }

  /**
   * Refresh Access Token from Refresh Token
   */
  static async refresh(refreshToken) {
    if (!refreshToken) {
      throw new AppError('No refresh token provided', 401);
    }

    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new AppError('User not found for this token', 401);
      }

      const newAccessToken = this.generateAccessToken(user);
      return { user, accessToken: newAccessToken };
    } catch (error) {
      throw new AppError('Invalid or expired refresh token. Please sign in again.', 401);
    }
  }
}

module.exports = AuthService;
