const { z } = require('zod');

const frequencySchema = z.object({
  type: z.enum(['daily', 'weekly']).default('daily'),
  days: z.array(z.number().int().min(0).max(6)).default([0, 1, 2, 3, 4, 5, 6]),
});

const createHabitSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional().default(''),
    category: z.enum(['health', 'study', 'fitness', 'mindfulness', 'work', 'other']).optional().default('other'),
    color: z.string().optional().default('#6366F1'),
    icon: z.string().optional().default('⚡'),
    frequency: frequencySchema.optional().default({ type: 'daily', days: [0, 1, 2, 3, 4, 5, 6] }),
    targetTime: z.string().optional().default(''),
    reminder: z.boolean().optional().default(false),
  }),
});

const updateHabitSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters').optional(),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
    category: z.enum(['health', 'study', 'fitness', 'mindfulness', 'work', 'other']).optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
    frequency: frequencySchema.optional(),
    targetTime: z.string().optional(),
    reminder: z.boolean().optional(),
    archived: z.boolean().optional(),
  }),
});

const checkInSchema = z.object({
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
    completed: z.boolean().optional(),
    note: z.string().max(300, 'Note cannot exceed 300 characters').optional().default(''),
  }),
});

module.exports = {
  createHabitSchema,
  updateHabitSchema,
  checkInSchema,
};
