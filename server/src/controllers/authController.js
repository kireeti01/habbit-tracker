const AuthService = require('../services/authService');
const { ApiResponse } = require('../utils/apiResponse');

const COOKIE_NAME = 'streakforge_rt';

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
});

class AuthController {
  static async register(req, res, next) {
    try {
      const { user, accessToken, refreshToken } = await AuthService.register(req.body);

      // Set Refresh Token in httpOnly cookie
      res.cookie(COOKIE_NAME, refreshToken, getCookieOptions());

      return ApiResponse.created(
        res,
        { user, accessToken },
        'Account registered successfully. Welcome to StreakForge!'
      );
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await AuthService.login(email, password);

      // Set Refresh Token in httpOnly cookie
      res.cookie(COOKIE_NAME, refreshToken, getCookieOptions());

      return ApiResponse.success(
        res,
        { user, accessToken },
        'Logged in successfully. Welcome back!'
      );
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        path: '/',
      });

      return ApiResponse.success(res, null, 'Logged out successfully.');
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies[COOKIE_NAME];
      const { user, accessToken } = await AuthService.refresh(refreshToken);

      return ApiResponse.success(
        res,
        { user, accessToken },
        'Token refreshed successfully.'
      );
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req, res) {
    return ApiResponse.success(
      res,
      { user: req.user },
      'User profile retrieved successfully.'
    );
  }
}

module.exports = AuthController;
