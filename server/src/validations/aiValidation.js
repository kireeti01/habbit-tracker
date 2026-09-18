const { z } = require('zod');

// Request Schemas
const suggestHabitsRequestSchema = z.object({
  body: z.object({
    goal: z.string().min(3, 'Please describe your goal in at least 3 characters').max(300),
  }),
});

const motivationRequestSchema = z.object({
  body: z.object({
    habitId: z.string().min(1, 'Habit ID is required'),
  }),
});

const chatRequestSchema = z.object({
  body: z.object({
    message: z.string().min(1, 'Message cannot be empty').max(500),
    conversationHistory: z
      .array(
        z.object({
          role: z.enum(['user', 'model', 'assistant']),
          text: z.string(),
        })
      )
      .optional()
      .default([]),
  }),
});

// AI Response Validation Schemas
const habitSuggestionResponseSchema = z.object({
  suggestions: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        category: z.enum(['health', 'study', 'fitness', 'mindfulness', 'work', 'other']),
        frequency: z.object({
          type: z.enum(['daily', 'weekly']),
          days: z.array(z.number()),
        }),
        whyItHelps: z.string(),
        color: z.string().default('#6366F1'),
        icon: z.string().default('⚡'),
      })
    )
    .min(1)
    .max(5),
});

const weeklyInsightResponseSchema = z.object({
  overallScore: z.number().min(0).max(100),
  summary: z.string(),
  bestDays: z.array(z.string()),
  weakDays: z.array(z.string()),
  workingWell: z.array(z.string()),
  slipping: z.array(z.string()),
  actionableTips: z.array(z.string()).min(2).max(4),
});

const motivationResponseSchema = z.object({
  headline: z.string(),
  message: z.string(),
  actionStep: z.string(),
});

module.exports = {
  suggestHabitsRequestSchema,
  motivationRequestSchema,
  chatRequestSchema,
  habitSuggestionResponseSchema,
  weeklyInsightResponseSchema,
  motivationResponseSchema,
};
