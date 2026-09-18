import React from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Sparkles,
  Zap,
  ShieldCheck,
  TrendingUp,
  Calendar,
  Award,
  ArrowRight,
  Bot,
  Brain,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-brand-500/15 rounded-full blur-[128px]" />
        <div className="absolute -top-20 right-1/4 w-96 h-96 bg-orange-500/15 rounded-full blur-[128px]" />
      </div>

      {/* Hero Section */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 flex flex-col items-center text-center">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-pulse-subtle">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>AI-Powered Habit &amp; Streak Mastery</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mb-6">
          Forge Unbreakable Habits.{' '}
          <span className="text-gradient">Ignite Infinite Streaks.</span>
        </h1>

        {/* Subhead */}
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
          StreakForge combines timezone-aware streak preservation, GitHub-style heatmaps, and personalized AI coaching to transform your daily rituals into permanent superpowers.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 hover:from-brand-500 hover:to-indigo-400 rounded-2xl shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Start Forging Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 text-base font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-2xl transition-all"
          >
            Sign In to Dashboard
          </Link>
        </div>

        {/* Live Mock Habit Tracker Card */}
        <div className="w-full max-w-4xl glass-card rounded-2xl p-6 sm:p-8 border border-slate-800/80 shadow-2xl relative overflow-hidden text-left mb-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Live Preview</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Daily Habit Momentum</h2>
            </div>
            <div className="flex items-center gap-3 bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-800">
              <Flame className="w-5 h-5 text-orange-500" />
              <div className="text-sm">
                <span className="text-slate-400">Total Active Streak: </span>
                <span className="font-extrabold text-orange-400">42 Days</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⚡</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  28 Days 🔥
                </span>
              </div>
              <h3 className="font-semibold text-white text-sm">Deep Work (2h)</h3>
              <p className="text-xs text-slate-400 mt-1">Daily Mon-Fri scheduled</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-brand-500/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🧘</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  14 Days 🔥
                </span>
              </div>
              <h3 className="font-semibold text-white text-sm">Mindful Meditation</h3>
              <p className="text-xs text-slate-400 mt-1">Daily mornings at 07:00</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🏃</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Streak at Risk ⏳
                </span>
              </div>
              <h3 className="font-semibold text-white text-sm">5km Evening Run</h3>
              <p className="text-xs text-slate-400 mt-1">Scheduled today: pending</p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl text-left">
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-4 border border-brand-500/20">
              <Bot className="w-6 h-6 text-brand-400" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Intelligent AI Coaching</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Generate scientifically sound habits from natural goals, receive 30-day behavioral trend reports, and chat directly with your habit coach.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4 border border-orange-500/20">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Bulletproof Streaks</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Our timezone-aware engine understands custom schedules (e.g. Mon/Wed/Fri). Off-days never break your streak, and backfills recalculate flawlessly.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
              <Calendar className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="font-bold text-lg text-white mb-2">GitHub-Style Heatmaps</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Visualize an entire year of commitment with yearly contribution matrices, Recharts analytics, and celebration animations on milestone days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
