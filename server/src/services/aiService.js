const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../config/env');
const AIInsight = require('../models/AIInsight');
const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const DateUtils = require('../utils/dateUtils');
const {
  habitSuggestionResponseSchema,
  weeklyInsightResponseSchema,
  motivationResponseSchema,
} = require('../validations/aiValidation');

class AIService {
  static getClient() {
    if (!env.GEMINI_API_KEY) {
      return null;
    }
    return new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }

  /**
   * Helper: Call Gemini model with timeout and JSON enforcement
   */
  static async callGeminiJSON(prompt, systemInstruction = '', retryCount = 1) {
    const genAI = this.getClient();
    if (!genAI) {
      return null; // Triggers smart fallback
    }

    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
        systemInstruction: systemInstruction || 'You are an elite behavioral science habit coach. Always return strict valid JSON.',
      });

      // 15 second timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI Request timed out')), 15000)
      );

      const generatePromise = model.generateContent(prompt);
      const response = await Promise.race([generatePromise, timeoutPromise]);
      const responseText = response.response.text();

      return JSON.parse(responseText);
    } catch (error) {
      console.warn(`[AIService] Gemini call error: ${error.message}`);
      if (retryCount > 0) {
        console.log('[AIService] Retrying Gemini request once...');
        return this.callGeminiJSON(prompt, systemInstruction, retryCount - 1);
      }
      return null;
    }
  }

  /**
   * 1. AI Habit Generator: user goal -> 3-5 structured habit suggestions
   */
  static async suggestHabits(goal) {
    const prompt = `
User Goal: "${goal}"

Generate between 3 and 5 actionable habits based on modern habit formation science (James Clear's Atomic Habits).
Return a JSON object strictly adhering to this structure:
{
  "suggestions": [
    {
      "title": "Short title (max 40 chars)",
      "description": "Specific daily cue and action (max 120 chars)",
      "category": "health" | "study" | "fitness" | "mindfulness" | "work" | "other",
      "frequency": {
        "type": "daily" | "weekly",
        "days": [0, 1, 2, 3, 4, 5, 6] // array of day numbers (0=Sun, 1=Mon...6=Sat)
      },
      "whyItHelps": "Psychological rationale why this builds momentum",
      "color": "#6366F1", // hex color code
      "icon": "⚡" // suitable emoji
    }
  ]
}
`;

    const rawJson = await this.callGeminiJSON(prompt);

    if (rawJson) {
      const parsed = habitSuggestionResponseSchema.safeParse(rawJson);
      if (parsed.success) {
        return parsed.data.suggestions;
      }
    }

    // High quality fallback if Gemini API key not set or timed out
    return this.getFallbackHabitSuggestions(goal);
  }

  /**
   * 2. AI Weekly Insights: Analyzes user's last 30 days of logs
   * Cached in MongoDB; regenerated at most once per 24 hours.
   */
  static async getWeeklyInsight(userId, userTimezone = 'UTC', forceRegenerate = false) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    if (!forceRegenerate) {
      const cached = await AIInsight.findOne({
        userId,
        type: 'weekly',
        generatedAt: { $gte: twentyFourHoursAgo },
      }).sort({ generatedAt: -1 });

      if (cached) {
        return {
          content: cached.content,
          cached: true,
          generatedAt: cached.generatedAt,
        };
      }
    }

    // Anonymized data preparation
    const habits = await Habit.find({ userId, archived: false }).select('title category currentStreak longestStreak frequency');
    const userToday = DateUtils.getTodayInTimezone(userTimezone);
    const startDate30d = DateUtils.subtractDays(userToday, 30);

    const logs = await HabitLog.find({
      userId,
      date: { $gte: startDate30d, $lte: userToday },
      completed: true,
    }).select('habitId date');

    const anonymizedHabitSummary = habits.map((h) => {
      const habitLogs = logs.filter((l) => l.habitId.toString() === h._id.toString());
      return {
        name: h.title,
        category: h.category,
        currentStreak: h.currentStreak,
        bestStreak: h.longestStreak,
        completionsLast30d: habitLogs.length,
      };
    });

    const prompt = `
Analyze the following anonymized 30-day habit data for a user:
User Timezone: ${userTimezone}
Active Habits: ${JSON.stringify(anonymizedHabitSummary)}

Produce a weekly coaching report in JSON adhering strictly to:
{
  "overallScore": 85, // number 0-100 score
  "summary": "2-3 sentence executive summary of user's momentum",
  "bestDays": ["Monday", "Wednesday"], // string list of high momentum days
  "weakDays": ["Friday", "Sunday"], // string list of vulnerable days
  "workingWell": ["Specific habit or pattern that is flourishing"],
  "slipping": ["Habit or pattern at risk of breaking"],
  "actionableTips": [
    "Tip 1: Implementation intention strategy",
    "Tip 2: Habit stacking suggestion",
    "Tip 3: Environment design tweak"
  ]
}
`;

    const rawJson = await this.callGeminiJSON(prompt);
    let insightContent = null;

    if (rawJson) {
      const parsed = weeklyInsightResponseSchema.safeParse(rawJson);
      if (parsed.success) {
        insightContent = parsed.data;
      }
    }

    if (!insightContent) {
      insightContent = this.getFallbackWeeklyInsight(anonymizedHabitSummary);
    }

    // Save to database cache
    const saved = await AIInsight.create({
      userId,
      type: 'weekly',
      content: insightContent,
      generatedAt: new Date(),
    });

    return {
      content: saved.content,
      cached: false,
      generatedAt: saved.generatedAt,
    };
  }

  /**
   * 3. Streak-at-risk / broken motivation
   */
  static async getMotivation(habitId, userId) {
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      return this.getFallbackMotivation('Daily Ritual', 1, true);
    }

    const prompt = `
Habit: "${habit.title}"
Category: "${habit.category}"
Current Streak: ${habit.currentStreak}
Best Streak: ${habit.longestStreak}
Streak Status: ${habit.currentStreak === 0 ? 'Recently Broken' : 'At Risk (Unchecked Today)'}

Provide a punchy, science-backed motivational boost to get them to do it now.
Return JSON:
{
  "headline": "Short bold encouraging headline",
  "message": "Inspiring message acknowledging their streak (max 2 sentences)",
  "actionStep": "Tiny 2-minute micro-step to start right now"
}
`;

    const rawJson = await this.callGeminiJSON(prompt);
    if (rawJson) {
      const parsed = motivationResponseSchema.safeParse(rawJson);
      if (parsed.success) {
        return parsed.data;
      }
    }

    return this.getFallbackMotivation(habit.title, habit.currentStreak, habit.currentStreak > 0);
  }

  /**
   * 4. AI Chat Coach: Interactive conversation with habit context
   */
  static async chatWithCoach(userId, message, conversationHistory = [], userTimezone = 'UTC') {
    const habits = await Habit.find({ userId, archived: false }).select('title category currentStreak longestStreak frequency');
    const anonymizedSummary = habits.map((h) => `${h.title} (${h.category}): ${h.currentStreak}d streak (best: ${h.longestStreak}d)`).join(', ');

    const systemInstruction = `You are "ForgeBot", an inspiring, empathetic, and scientifically grounded habit coach inside the StreakForge app.
The user is currently tracking these habits: [${anonymizedSummary || 'None created yet'}].
User timezone: ${userTimezone}.
Provide concise, actionable advice (2-4 paragraphs max). Recommend practical behavioral techniques like habit stacking, the 2-minute rule, or environmental cues. Never ask for or mention passwords or private keys.`;

    const genAI = this.getClient();
    if (!genAI) {
      return this.getFallbackChatResponse(message, habits);
    }

    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction,
      });

      const chat = model.startChat({
        history: (conversationHistory || []).map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        })),
      });

      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (err) {
      console.warn('[AIService] Chat error:', err.message);
      return this.getFallbackChatResponse(message, habits);
    }
  }

  // --- Intelligent Fallback Generators ---

  static getFallbackHabitSuggestions(goal) {
    const normalized = goal.toLowerCase();
    if (normalized.includes('fit') || normalized.includes('exercise') || normalized.includes('run')) {
      return [
        {
          title: 'Morning 15-Min Calisthenics',
          description: '3 rounds of push-ups, squats, and planks immediately after drinking water.',
          category: 'fitness',
          frequency: { type: 'daily', days: [0, 1, 2, 3, 4, 5, 6] },
          whyItHelps: 'Early physical momentum elevates dopamine and sets a proactive tone for the whole day.',
          color: '#F97316',
          icon: '⚡',
        },
        {
          title: '30-Minute Brisk Walk',
          description: 'Outdoor walk listening to a podcast or audiobook during afternoon slump.',
          category: 'health',
          frequency: { type: 'weekly', days: [1, 2, 3, 4, 5] },
          whyItHelps: 'Low-impact zone-2 cardio clears brain fog and triggers restorative neuroplasticity.',
          color: '#10B981',
          icon: '🏃',
        },
        {
          title: 'Evening Stretching & Mobility',
          description: '10 minutes of gentle hip and spine openers before sleeping.',
          category: 'mindfulness',
          frequency: { type: 'daily', days: [0, 1, 2, 3, 4, 5, 6] },
          whyItHelps: 'Activates parasympathetic nervous system to improve sleep architecture and deep recovery.',
          color: '#8B5CF6',
          icon: '🧘',
        },
      ];
    }

    return [
      {
        title: 'Deep Focus Block',
        description: '45 minutes of distraction-free single-tasking with phone out of sight.',
        category: 'work',
        frequency: { type: 'weekly', days: [1, 2, 3, 4, 5] },
        whyItHelps: 'Protects cognitive flow state from digital dopamine fragmentation.',
        color: '#3B82F6',
        icon: '💻',
      },
      {
        title: '15-Page Book Reading',
        description: 'Read 15 pages of non-fiction with a warm beverage before bed.',
        category: 'study',
        frequency: { type: 'daily', days: [0, 1, 2, 3, 4, 5, 6] },
        whyItHelps: 'Accumulates over 20 finished books per year while displacing nighttime blue light.',
        color: '#6366F1',
        icon: '📚',
      },
      {
        title: 'Mindful Morning Breathing',
        description: '5 minutes of physiological sigh or box breathing upon waking up.',
        category: 'mindfulness',
        frequency: { type: 'daily', days: [0, 1, 2, 3, 4, 5, 6] },
        whyItHelps: 'Lowers baseline cortisol and trains voluntary attentional control.',
        color: '#8B5CF6',
        icon: '🧘',
      },
    ];
  }

  static getFallbackWeeklyInsight(habits) {
    const totalCompletions = habits.reduce((acc, h) => acc + h.completionsLast30d, 0);
    const score = Math.min(95, Math.max(50, totalCompletions * 5 + 40));

    return {
      overallScore: score,
      summary: 'Solid foundational consistency over the past 30 days. Your core habits are establishing steady neuro-pathways.',
      bestDays: ['Monday', 'Tuesday', 'Thursday'],
      weakDays: ['Friday', 'Sunday'],
      workingWell: [
        habits[0] ? `Strong retention on "${habits[0].name}"` : 'Consistent start-of-week momentum',
      ],
      slipping: ['Weekend routines tend to encounter friction due to schedule disruption.'],
      actionableTips: [
        'Apply the 2-Minute Rule: On low-energy days, complete just 2 minutes rather than skipping completely.',
        'Use Habit Stacking: Anchor your newest habit immediately after a well-established daily anchor (like morning coffee).',
        'Prepare your environment the evening prior to eliminate starting resistance.',
      ],
    };
  }

  static getFallbackMotivation(title, streak, isAtRisk) {
    if (isAtRisk) {
      return {
        headline: `Protect Your ${streak}-Day Streak! 🔥`,
        message: `Your streak for "${title}" is on the line today. It took ${streak} days of commitment to get here; don't break the chain.`,
        actionStep: 'Spend just 2 focused minutes on it right now to keep the flame alive.',
      };
    }
    return {
      headline: 'A Minor Stumble Is Not Defeat',
      message: `The secret of top performers isn't never falling—it's never missing twice. Today is Day 1 of your greatest streak for "${title}".`,
      actionStep: 'Complete one small round today to reset your momentum immediately.',
    };
  }

  static getFallbackChatResponse(message, habits) {
    const lower = message.toLowerCase();
    if (lower.includes('start') || lower.includes('begin') || lower.includes('hard')) {
      return "The hardest part of building any habit is the friction of getting started. Try the **Two-Minute Rule**: scale down the habit until it takes under two minutes. Want to read more? Read one page. Want to exercise? Put on your running shoes. Once you show up, momentum takes over.";
    }
    if (lower.includes('streak') || lower.includes('miss') || lower.includes('broke')) {
      return "Missing a day is an event; giving up is a decision. Research by James Clear shows that missing once has virtually zero measurable impact on long-term habit automaticity—provided you never miss twice. Recommit today with a single check-in!";
    }
    return `Great question! Looking at your current habit setup (${habits.length} habits tracked), focus on **Implementation Intentions**: clearly define *WHEN* and *WHERE* you will execute your ritual (e.g., 'After I finish my morning coffee at the kitchen table, I will meditate for 10 minutes'). What specific challenge are you feeling right now?`;
  }
}

module.exports = AIService;
