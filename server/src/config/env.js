const dotenv = require('dotenv');
dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/streakforge',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'streakforge_jwt_access_secret_super_secure_key_123!@#',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'streakforge_jwt_refresh_secret_super_secure_key_456!@#',
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || ''
};

module.exports = env;
