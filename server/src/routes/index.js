const express = require('express');
const mongoose = require('mongoose');
const { ApiResponse } = require('../utils/apiResponse');

const router = express.Router();

const authRoutes = require('./authRoutes');
const habitRoutes = require('./habitRoutes');
const statsRoutes = require('./statsRoutes');
const aiRoutes = require('./aiRoutes');
const userRoutes = require('./userRoutes');

// Auth Endpoints
router.use('/auth', authRoutes);

// Habits and Check-ins Endpoints
router.use('/habits', habitRoutes);

// Statistics & Analytics Endpoints
router.use('/stats', statsRoutes);

// AI Coach Endpoints
router.use('/ai', aiRoutes);

// User Profile & Settings Endpoints
router.use('/users', userRoutes);

// Health Check Endpoint
router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }[dbState] || 'unknown';

  return ApiResponse.success(
    res,
    {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development',
    },
    'StreakForge API is healthy and operational'
  );
});

module.exports = router;
