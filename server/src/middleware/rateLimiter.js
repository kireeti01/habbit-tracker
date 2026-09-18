const rateLimit = require('express-rate-limit');

// General API rate limiter: 300 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter Auth limiter: 20 requests per 15 minutes to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again in 15 minutes.',
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter AI limiter: 25 requests per 15 minutes per IP
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: {
    success: false,
    message: 'AI coach rate limit reached. Please wait a few minutes before trying again.',
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  aiLimiter,
};
