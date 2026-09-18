const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { format, subDays } = require('date-fns');
const env = require('../config/env');
const User = require('../models/User');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const AIInsight = require('../models/AIInsight');
const StreakService = require('../services/streakService');
const DateUtils = require('../utils/dateUtils');

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(env.MONGO_URI);
    console.log('[Seed] Connected. Clearing existing demo data...');

    // Clear previous seed data
    await User.deleteMany({ email: { $in: ['alex@streakforge.io', 'demo@streakforge.io', 'john@example.com'] } });
    await Habit.deleteMany({});
    await HabitLog.deleteMany({});
    await AIInsight.deleteMany({});

    console.log('[Seed] Creating demo users...');
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash('Password123!', salt);

    const alex = await User.create({
      name: 'Alex Mercer',
      email: 'alex@streakforge.io',
      passwordHash,
      timezone: 'America/New_York',
      theme: 'dark',
    });

    const demoUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash,
      timezone: 'America/New_York',
      theme: 'dark',
    });

    console.log('[Seed] Creating diverse habit set for Alex...');
    const habitsData = [
      {
        userId: alex._id,
        title: 'Morning Vipassana Meditation',
        description: '20 minutes of silent mindfulness directly upon waking up.',
        category: 'mindfulness',
        color: '#8B5CF6',
        icon: '🧘',
        frequency: { type: 'daily', days: [0, 1, 2, 3, 4, 5, 6] },
        targetTime: '06:30',
        reminder: true,
      },
      {
        userId: alex._id,
        title: 'Deep Work Focus Block',
        description: '90-minute uninterrupted sprint with phone outside the room.',
        category: 'work',
        color: '#6366F1',
        icon: '💻',
        frequency: { type: 'weekly', days: [1, 2, 3, 4, 5] },
        targetTime: '09:00',
        reminder: true,
      },
      {
        userId: alex._id,
        title: '5km Sunset Trail Run',
        description: 'Aerobic zone-2 trail run through the park.',
        category: 'fitness',
        color: '#F97316',
        icon: '🏃',
        frequency: { type: 'weekly', days: [1, 3, 5] },
        targetTime: '17:30',
        reminder: false,
      },
      {
        userId: alex._id,
        title: 'Read 20 Pages Non-Fiction',
        description: 'Books on behavioral psychology, systems, or technology.',
        category: 'study',
        color: '#3B82F6',
        icon: '📚',
        frequency: { type: 'daily', days: [0, 1, 2, 3, 4, 5, 6] },
        targetTime: '21:30',
        reminder: false,
      },
      {
        userId: alex._id,
        title: '3L Hydration & Electrolytes',
        description: 'Daily baseline mineralized water intake.',
        category: 'health',
        color: '#10B981',
        icon: '💧',
        frequency: { type: 'daily', days: [0, 1, 2, 3, 4, 5, 6] },
        targetTime: '12:00',
        reminder: false,
      },
    ];

    const habits = await Habit.insertMany(habitsData);

    console.log('[Seed] Generating 60 days of historical logs...');
    const userToday = DateUtils.getTodayInTimezone(alex.timezone);
    const logsToInsert = [];

    // For each habit, generate 60 days of realistic check-in history
    for (const habit of habits) {
      const completedDates = [];

      for (let i = 59; i >= 0; i--) {
        const dateStr = DateUtils.subtractDays(userToday, i);
        const isScheduled = StreakService.isScheduledDay(dateStr, habit.frequency);

        if (!isScheduled) continue;

        // Completion probability: high (88%) for meditation & reading, 80% for others
        const isRecent = i <= 14;
        const probability = isRecent ? 0.95 : 0.82;
        const completed = Math.random() < probability;

        if (completed) {
          completedDates.push(dateStr);
          logsToInsert.push({
            userId: alex._id,
            habitId: habit._id,
            date: dateStr,
            completed: true,
            note: i % 7 === 0 ? 'Felt high clarity today' : '',
          });
        }
      }

      // Compute streak numbers
      const streakInfo = StreakService.calculateStreaks(habit, completedDates, userToday);
      habit.currentStreak = streakInfo.currentStreak;
      habit.longestStreak = streakInfo.longestStreak;
      await habit.save();
    }

    await HabitLog.insertMany(logsToInsert);
    console.log(`[Seed] Created ${logsToInsert.length} historical logs.`);

    console.log('[Seed] Creating cached weekly AI coach report...');
    await AIInsight.create({
      userId: alex._id,
      type: 'weekly',
      content: {
        overallScore: 88,
        summary:
          'Outstanding momentum across deep work and mindfulness. You are exhibiting high psychological stamina and steady habit automaticity.',
        bestDays: ['Monday', 'Tuesday', 'Wednesday'],
        weakDays: ['Sunday'],
        workingWell: [
          'Morning Vipassana Meditation has reached an uninterrupted 14-day streak.',
          'Read 20 Pages Non-Fiction is completed with 93% fidelity.',
        ],
        slipping: [
          'Sunday evening routines experience mild friction due to weekend schedule transition.',
        ],
        actionableTips: [
          'Prepare your book and reading lamp on Sunday afternoon to eliminate bedtime friction.',
          'Stack your 5km run directly after closing your laptop at 17:30 to avoid decision fatigue.',
          'Use the 2-minute rule when energy is low: simply put on running shoes and step outside.',
        ],
      },
      generatedAt: new Date(),
    });

    console.log('----------------------------------------------------');
    console.log('✅ StreakForge Seed Completed Successfully!');
    console.log('Demo Credentials:');
    console.log('   Email:    alex@streakforge.io');
    console.log('   Password: Password123!');
    console.log('Or:');
    console.log('   Email:    john@example.com');
    console.log('   Password: Password123!');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
