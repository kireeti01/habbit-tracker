import React, { useState } from 'react';
import { Bot, Sparkles, Zap, ArrowRight, CheckCircle2, Clock, Calendar, BrainCircuit } from 'lucide-react';
import confetti from 'canvas-confetti';

const PRESET_GOALS = [
  {
    id: 'fitness',
    label: 'Run 10K & Marathon Prep',
    icon: '🏃',
    analysis: 'Optimized for aerobic base building & injury prevention.',
    habits: [
      { name: 'Zone 2 Morning Run (30m)', frequency: 'Mon, Wed, Fri', time: '06:30 AM', friction: 'Low' },
      { name: 'Dynamic Leg Mobility Routine (10m)', frequency: 'Daily', time: '07:15 AM', friction: 'Very Low' },
      { name: 'Post-Workout Hydration + Electrolytes', frequency: 'Daily', time: '07:30 AM', friction: 'Very Low' },
    ],
  },
  {
    id: 'deepwork',
    label: 'Deep Work & Coding Mastery',
    icon: '💻',
    analysis: 'Calibrated for flow state triggers and cognitive endurance.',
    habits: [
      { name: '2-Hour Zero Distraction Deep Code Sprint', frequency: 'Mon-Fri', time: '09:00 AM', friction: 'Medium' },
      { name: 'Git Commit & Architecture Log', frequency: 'Daily', time: '05:00 PM', friction: 'Low' },
      { name: 'Daily Tech Article / Whitepaper (15m)', frequency: 'Daily', time: '08:30 PM', friction: 'Low' },
    ],
  },
  {
    id: 'mindset',
    label: 'Mindfulness & Peak Focus',
    icon: '🧘',
    analysis: 'Engineered for dopamine regulation and stress resilience.',
    habits: [
      { name: 'Box Breathing Meditation (15m)', frequency: 'Daily', time: '07:00 AM', friction: 'Very Low' },
      { name: 'Daily Wins & Gratitude Journaling', frequency: 'Daily', time: '09:30 PM', friction: 'Low' },
      { name: 'Digital Sunset: No Blue Light After 9 PM', frequency: 'Daily', time: '09:00 PM', friction: 'Medium' },
    ],
  },
  {
    id: 'books',
    label: 'Read 25 Books This Year',
    icon: '📚',
    analysis: 'Structured for effortless compounding knowledge ingestion.',
    habits: [
      { name: 'Read 20 Pages with Morning Coffee', frequency: 'Daily', time: '07:30 AM', friction: 'Very Low' },
      { name: 'Highlight & Note 1 Key Concept', frequency: 'Daily', time: '08:00 AM', friction: 'Low' },
      { name: 'Weekly Reading Synthesis Review', frequency: 'Every Sunday', time: '11:00 AM', friction: 'Low' },
    ],
  },
];

export default function InteractiveAICoachDemo() {
  const [selectedGoal, setSelectedGoal] = useState(PRESET_GOALS[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSelectGoal = (goal) => {
    if (goal.id === selectedGoal.id) return;
    setIsGenerating(true);
    setTimeout(() => {
      setSelectedGoal(goal);
      setIsGenerating(false);
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#06b6d4', '#a855f7'],
      });
    }, 450);
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-gradient-to-b from-[#0e1628]/95 to-[#090e1c]/95 border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Background glow highlights */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="text-left pb-8 border-b border-slate-800/80">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Bot className="w-3.5 h-3.5 text-cyan-400" />
          <span>Live AI Habit Synthesis</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Select a Goal — Watch AI Architect Your Daily Habits
        </h3>
        <p className="text-slate-400 text-sm mt-1">
          StreakForge AI converts high-level ambitions into frictionless daily micro-routines.
        </p>
      </div>

      {/* Goal Selector Buttons */}
      <div className="my-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {PRESET_GOALS.map((goal) => {
          const isSelected = selectedGoal.id === goal.id;
          return (
            <button
              key={goal.id}
              onClick={() => handleSelectGoal(goal)}
              className={`p-3 sm:p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-gradient-to-b from-cyan-500/20 to-purple-600/20 border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="text-2xl">{goal.icon}</span>
              <span className={`text-xs sm:text-sm font-bold block ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {goal.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* AI Generated Habit Roadmap Box */}
      <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 sm:p-6 transition-all relative">
        {isGenerating ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-cyan-400">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <span className="text-xs font-semibold tracking-wider uppercase animate-pulse">
              Synthesizing Behavioral Habit Chain...
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top Insight Badge */}
            <div className="flex items-center gap-2 text-xs text-slate-400 pb-3 border-b border-slate-800/80">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="font-semibold text-slate-300">AI Behavioral Analysis:</span>
              <span className="text-slate-400 italic">{selectedGoal.analysis}</span>
            </div>

            {/* Generated Habits List */}
            <div className="space-y-3">
              {selectedGoal.habits.map((habit, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-sm font-bold text-white">{habit.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      {habit.frequency}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-400" />
                      {habit.time}
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      {habit.friction} Friction
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
