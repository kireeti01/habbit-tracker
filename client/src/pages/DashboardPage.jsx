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

  const handleQuickCheck = async (habitId) => {
    try {
      const res = await toggleCheckIn(habitId, todayStr);
      if (res?.log?.completed) {
        toast.success('Check-in logged! Momentum surging 🔥');
        if (progressPercent >= 75) {
          triggerCelebration();
        }
      }
      // Refresh stats
      statsApi.getOverview().then((r) => setStats(r.data));
      statsApi.getWeekly().then((r) => setWeeklyData(r.data));
    } catch (e) {
      // Handled by store
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>StreakForge Engine Ready</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Forging Greatness, {user?.name || 'Habit Master'}!
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Consistency compounds into destiny. You have completed{' '}
              <span className="text-emerald-400 font-bold">{todayCompletedCount}</span> of{' '}
              <span className="text-white font-bold">{todayHabits.length}</span> scheduled habits today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFormModalOpen(true)}
              className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Forge Habit
            </button>
            <Link
              to="/ai-coach"
              className="px-4 py-2.5 rounded-xl font-semibold text-xs text-brand-300 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-400" /> AI Coach
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <StatCards stats={stats} loading={loading} />

      {/* Today's Queue & Weekly Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Queue */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-bold text-base text-white">Today&apos;s Focus Queue</h2>
                <p className="text-xs text-slate-400">
                  {format(new Date(), 'EEEE, MMMM d')} &bull; One-click daily log
                </p>
              </div>
              <span className="text-xs font-bold text-slate-300">
                {progressPercent}% Done
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Habits List for Today */}
            {todayHabits.length > 0 ? (
              <div className="space-y-3">
                {todayHabits.map((habit) => {
                  const isDone = habit.todayCompleted;
                  return (
                    <div
                      key={habit._id}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                        isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg border border-white/5"
                          style={{ backgroundColor: `${habit.color || '#6366F1'}20` }}
                        >
                          {habit.icon || '⚡'}
                        </div>
                        <div>
                          <Link
                            to={`/habits/${habit._id}`}
                            className="font-bold text-sm text-white hover:text-brand-400 transition-colors"
                          >
                            {habit.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                            <span className="capitalize">{habit.category}</span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1 text-orange-400 font-semibold">
                              <Flame className="w-3 h-3 text-orange-500" />
                              {habit.currentStreak || 0}d streak
                            </span>
                            {habit.isAtRisk && (
                              <span className="text-amber-400 font-bold flex items-center gap-0.5">
                                <AlertTriangle className="w-3 h-3" /> at risk
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQuickCheck(habit._id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                            : 'bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white'
                        }`}
                      >
                        {isDone ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Done</span>
                          </>
                        ) : (
                          <span>Check-in</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">
                No habits scheduled for today. Take a well-deserved recovery or forge a new daily habit!
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <Link
              to="/habits"
              className="text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1"
            >
              <span>Manage all {habits.length} habits</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={triggerCelebration}
              className="text-slate-500 hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Celebrate</span>
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
