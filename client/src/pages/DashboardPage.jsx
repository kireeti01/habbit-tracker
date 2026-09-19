import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  CheckCircle,
  Plus,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Check,
  Calendar,
  AlertTriangle,
  Zap,
  Award,
  Clock,
  Target,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useHabitStore } from '../store/habitStore';
import { statsApi } from '../api/statsApi';
import StatCards from '../components/stats/StatCards';
import WeeklyCompletionChart from '../components/stats/WeeklyCompletionChart';
import MilestoneBadges, { triggerCelebration } from '../components/stats/MilestoneBadges';
import HabitFormModal from '../components/habits/HabitFormModal';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { habits, fetchHabits, toggleCheckIn, createHabit } = useHabitStore();

  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [checkingId, setCheckingId] = useState(null);

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const loadDashboard = async () => {
    try {
      setLoading(true);
      await fetchHabits();
      const [statsRes, weeklyRes] = await Promise.all([
        statsApi.getOverview(),
        statsApi.getWeekly(),
      ]);
      setStats(statsRes.data);
      setWeeklyData(weeklyRes.data);
    } catch (err) {
      toast.error('Failed to refresh dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Today's scheduled habits
  const todayHabits = habits.filter((h) => !h.archived && h.todayScheduled !== false);
  const todayCompletedCount = todayHabits.filter((h) => h.todayCompleted).length;
  const progressPercent =
    todayHabits.length > 0 ? Math.round((todayCompletedCount / todayHabits.length) * 100) : 0;

  // Gamification XP estimate
  const currentLevel = Math.floor((stats?.activeStreaks || 0) * 1.5) + 1;
  const xpCurrent = (todayCompletedCount * 120) + ((stats?.activeStreaks || 0) * 80);
  const xpNeeded = 1000;
  const xpPercent = Math.min(100, Math.round((xpCurrent / xpNeeded) * 100));

  const handleQuickCheck = async (habitId) => {
    try {
      setCheckingId(habitId);
      const res = await toggleCheckIn(habitId, todayStr);
      if (res?.log?.completed) {
        toast.success('Check-in logged! Momentum surging 🔥');
        if (progressPercent >= 60 || todayCompletedCount + 1 === todayHabits.length) {
          triggerCelebration();
        }
      }
      // Refresh stats
      statsApi.getOverview().then((r) => setStats(r.data));
      statsApi.getWeekly().then((r) => setWeeklyData(r.data));
    } catch (e) {
      // Handled by store
    } finally {
      setCheckingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* 3D Modern Hero Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0d1629]/95 via-[#0a1120]/95 to-[#120e29]/95 border-2 border-cyan-500/40 p-6 sm:p-8 shadow-[0_0_35px_rgba(6,182,212,0.15)] overflow-hidden backdrop-blur-xl">
        {/* Ambient Inner Glowing Accents */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            {/* Header pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>StreakForge Engine Active</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Welcome Back,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-200 to-purple-400">
                {user?.name || 'Habit Master'}
              </span>{' '}
              🔥
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Consistency compounds into greatness. You have completed{' '}
              <span className="text-cyan-400 font-extrabold">{todayCompletedCount}</span> of{' '}
              <span className="text-white font-extrabold">{todayHabits.length}</span> scheduled habits today.
            </p>

            {/* Level & XP progression bar */}
            <div className="pt-2 flex items-center gap-4 max-w-md">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-black">
                <Zap className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                <span>Level {currentLevel}</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
                  <span>Momentum XP</span>
                  <span className="text-cyan-400">{xpCurrent} / {xpNeeded} XP</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-700 shimmer-bar"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0">
            <button
              onClick={() => setFormModalOpen(true)}
              className="px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-cyan-400/60 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-cyan-200" />
              <span>Forge Habit</span>
            </button>

            <Link
              to="/ai-coach"
              className="px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm text-slate-200 hover:text-white bg-[#0e1628]/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-400/50 rounded-2xl transition-all shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>AI Coach</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <StatCards stats={stats} loading={loading} />

      {/* Today's Focus Queue & Weekly Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Focus Queue */}
        <div className="lg:col-span-2 rounded-3xl bg-[#0c1322]/85 border border-slate-800/80 p-6 flex flex-col justify-between shadow-xl backdrop-blur-xl hover:border-slate-700/80 transition-all">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-extrabold text-lg text-white flex items-center gap-2">
                  <span>Today&apos;s Focus Queue</span>
                  <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                    Live
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {format(new Date(), 'EEEE, MMMM d')} &bull; One-click daily execution
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                  {progressPercent}% Done
                </span>
                <div className="text-[10px] text-slate-400">
                  {todayCompletedCount}/{todayHabits.length} Complete
                </div>
              </div>
            </div>

            {/* Glowing Gradient Progress Bar */}
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden mb-6 border border-slate-800/80">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-700 shimmer-bar"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Habits List for Today */}
            {todayHabits.length > 0 ? (
              <div className="space-y-3">
                {todayHabits.map((habit) => {
                  const isDone = habit.todayCompleted;
                  const isChecking = checkingId === habit._id;

                  return (
                    <div
                      key={habit._id}
                      className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                        isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                          : 'bg-[#090f1d]/80 border-slate-800/90 hover:border-slate-700 text-slate-200 hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl border border-white/10 shadow-md"
                          style={{ backgroundColor: `${habit.color || '#06b6d4'}25` }}
                        >
                          {habit.icon || '⚡'}
                        </div>
                        <div>
                          <Link
                            to={`/habits/${habit._id}`}
                            className="font-bold text-sm sm:text-base text-white hover:text-cyan-400 transition-colors"
                          >
                            {habit.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                            <span className="capitalize px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-300">
                              {habit.category}
                            </span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1 text-orange-400 font-bold">
                              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-flame" />
                              {habit.currentStreak || 0}d streak
                            </span>
                            {habit.isAtRisk && (
                              <span className="text-amber-400 font-bold flex items-center gap-0.5 text-[10px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 animate-pulse">
                                <AlertTriangle className="w-3 h-3" /> at risk
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isChecking}
                        onClick={() => handleQuickCheck(habit._id)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md ${
                          isDone
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                            : 'bg-slate-800/90 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 text-slate-300 hover:text-white border border-slate-700 hover:border-cyan-400/50 hover:scale-105 active:scale-95'
                        }`}
                      >
                        {isChecking ? (
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : isDone ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Done 🔥</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                            <span>Check-in</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                No habits scheduled for today. Take a well-deserved recovery or forge a new daily habit!
              </div>
            )}
          </div>

          <div className="pt-4 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <Link
              to="/habits"
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors"
            >
              <span>Manage all {habits.length} habits</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={triggerCelebration}
              className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ignite Confetti</span>
            </button>
          </div>
        </div>

        {/* Weekly Completion Chart */}
        <WeeklyCompletionChart data={weeklyData} loading={loading} />
      </div>

      {/* Milestone Badges Section */}
      <MilestoneBadges streak={stats?.bestStreak || 0} title="Overall Journey Milestones" />

      {/* Habit Create Modal */}
      <HabitFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={async (data) => {
          const res = await createHabit(data);
          if (res?.success) {
            loadDashboard();
          }
          return res;
        }}
      />
    </div>
  );
}

