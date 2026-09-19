import React, { useState } from 'react';
import {
  Flame,
  Check,
  Plus,
  Sparkles,
  Trophy,
  Zap,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PRESET_HABITS = [
  { id: 1, name: 'Drink 2.5L Water 💧', category: 'Health', streak: 12, completed: false },
  { id: 2, name: 'Morning Meditation (15m) 🧘', category: 'Mindset', streak: 34, completed: true },
  { id: 3, name: 'Read 20 Pages of Book 📚', category: 'Growth', streak: 9, completed: false },
  { id: 4, name: 'Hit 10,000 Steps 🏃', category: 'Fitness', streak: 21, completed: true },
  { id: 5, name: 'No Social Media after 9 PM 🌙', category: 'Sleep', streak: 5, completed: false },
];

export default function InteractiveSandbox() {
  const [habits, setHabits] = useState(PRESET_HABITS);
  const [newHabitName, setNewHabitName] = useState('');
  const [customStreak, setCustomStreak] = useState(34);

  const completedCount = habits.filter((h) => h.completed).length;
  const completionRate = Math.round((completedCount / habits.length) * 100) || 0;

  const toggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const next = !h.completed;
          const nextStreak = next ? h.streak + 1 : Math.max(0, h.streak - 1);
          if (next) {
            confetti({
              particleCount: 40,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#06b6d4', '#a855f7', '#10b981'],
            });
          }
          return { ...h, completed: next, streak: nextStreak };
        }
        return h;
      })
    );
  };

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    const newHabit = {
      id: Date.now(),
      name: newHabitName.trim(),
      category: 'Custom',
      streak: 1,
      completed: true,
    };
    setHabits([newHabit, ...habits]);
    setNewHabitName('');
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#06b6d4', '#ec4899', '#3b82f6'],
    });
  };

  const handleReset = () => {
    setHabits(PRESET_HABITS);
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-[#0e1628]/90 to-[#090d18]/90 border border-slate-800/80 p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Background glow accents */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Live Sandbox</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Feel the Rush of Completing Habits
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Tap to check off habits and experience our instant dopamine streak engine.
          </p>
        </div>

        {/* Momentum Metric Pills */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Daily Progress</span>
              <span className="text-base font-bold text-white">
                {completedCount}/{habits.length} Done ({completionRate}%)
              </span>
            </div>
          </div>
          <button
            onClick={handleReset}
            title="Reset demo"
            className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Habit Input Form */}
      <form onSubmit={handleAddHabit} className="my-6 flex gap-2 sm:gap-3">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="Try typing a habit, e.g. 'Read 10 pages' or 'Drink 2L water'..."
          className="flex-1 bg-slate-950/80 border border-slate-800 focus:border-cyan-500/80 focus:ring-2 focus:ring-cyan-500/20 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all"
        />
        <button
          type="submit"
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">Add Habit</span>
        </button>
      </form>

      {/* Habit List */}
      <div className="space-y-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            className={`cursor-pointer group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
              habit.completed
                ? 'bg-slate-900/90 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all ${
                  habit.completed
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                    : 'border-2 border-slate-700 group-hover:border-slate-500'
                }`}
              >
                {habit.completed && <Check className="w-4 h-4 stroke-[3]" />}
              </button>
              <div>
                <span
                  className={`text-sm sm:text-base font-semibold block transition-colors ${
                    habit.completed ? 'text-white line-through decoration-cyan-400/60' : 'text-slate-200'
                  }`}
                >
                  {habit.name}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">{habit.category}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold">
                <Flame
                  className={`w-3.5 h-3.5 ${
                    habit.completed ? 'text-orange-400 fill-orange-400' : 'text-slate-500'
                  }`}
                />
                <span className={habit.completed ? 'text-orange-300' : 'text-slate-400'}>
                  {habit.streak} {habit.streak === 1 ? 'Day' : 'Days'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
