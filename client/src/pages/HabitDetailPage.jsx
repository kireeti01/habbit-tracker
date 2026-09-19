import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Flame,
  Check,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  Archive,
  RotateCcw,
  Sparkles,
  Zap,
  Activity,
  Award,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { habitApi } from '../api/habitApi';
import { statsApi } from '../api/statsApi';
import GitHubHeatmap from '../components/stats/GitHubHeatmap';
import MilestoneBadges from '../components/stats/MilestoneBadges';
import HabitFormModal from '../components/habits/HabitFormModal';
import BackfillModal from '../components/habits/BackfillModal';
import { DAYS_OF_WEEK } from '../utils/categoryColors';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function HabitDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [habit, setHabit] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [backfillModalOpen, setBackfillModalOpen] = useState(false);

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const loadHabitData = async () => {
    try {
      setLoading(true);
      const [habitRes, heatmapRes, logsRes] = await Promise.all([
        habitApi.getHabitById(id),
        statsApi.getHeatmap(id),
        habitApi.getLogs(id),
      ]);
      setHabit(habitRes.data);
      setHeatmapData(heatmapRes.data.heatmap || []);
      setLogs(logsRes.data || []);
    } catch (err) {
      toast.error('Failed to load habit details');
      navigate('/habits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabitData();
  }, [id]);

  const handleCheckInToday = async () => {
    if (checking) return;
    setChecking(true);
    try {
      const res = await habitApi.checkIn(id, { date: todayStr });
      if (!habit.todayCompleted) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#a855f7', '#10b981', '#f59e0b'],
        });
        toast.success('Completed today! Streak updated 🔥');
      } else {
        toast.success('Check-in status updated');
      }
      loadHabitData();
    } catch (err) {
      toast.error('Check-in failed');
    } finally {
      setChecking(false);
    }
  };

  const handleEditSubmit = async (data) => {
    try {
      await habitApi.updateHabit(id, data);
      toast.success('Habit updated successfully');
      loadHabitData();
      return { success: true };
    } catch (err) {
      toast.error('Failed to update habit');
      return { success: false };
    }
  };

  const handleArchiveToggle = async () => {
    try {
      const res = await habitApi.toggleArchive(id);
      toast.success(res.data.archived ? 'Habit archived' : 'Habit restored');
      loadHabitData();
    } catch (err) {
      toast.error('Failed to update archive status');
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Permanently delete "${habit.title}" and all its logs?`)) {
      try {
        await habitApi.deleteHabit(id);
        toast.success('Habit permanently deleted');
        navigate('/habits');
      } catch (err) {
        toast.error('Failed to delete habit');
      }
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 animate-pulse">Loading habit telemetry...</p>
      </div>
    );
  }

  if (!habit) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <Link
        to="/habits"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors py-1 px-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Habits Grid</span>
      </Link>

      {/* Habit Header Hero Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800/90 relative overflow-hidden shadow-2xl backdrop-blur-2xl">
        <div
          className="absolute top-0 left-0 right-0 h-1.5 shadow-lg"
          style={{
            backgroundColor: habit.color || '#06b6d4',
            boxShadow: `0 0 15px ${habit.color || '#06b6d4'}80`,
          }}
        />

        {/* Ambient Glow */}
        <div
          className="absolute -top-24 -left-24 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: habit.color || '#06b6d4' }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4 sm:gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xl border border-white/10 flex-shrink-0 transition-transform hover:scale-105"
              style={{
                backgroundColor: `${habit.color || '#06b6d4'}25`,
                boxShadow: `0 0 20px ${habit.color || '#06b6d4'}30`,
              }}
            >
              {habit.icon || '⚡'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 capitalize shadow-inner">
                  {habit.category}
                </span>
                {habit.targetTime && (
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {habit.targetTime}
                  </span>
                )}
                {habit.archived && (
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Archived
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{habit.title}</h1>
              {habit.description && (
                <p className="text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">{habit.description}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              disabled={checking || habit.archived}
              onClick={handleCheckInToday}
              className={`px-5 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-lg ${
                habit.todayCompleted
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 active:scale-95'
              }`}
            >
              {checking ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : habit.todayCompleted ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Completed Today 🔥</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-cyan-300 text-cyan-300" />
                  <span>Check-in Today</span>
                </>
              )}
            </button>

            <button
              onClick={() => setBackfillModalOpen(true)}
              className="px-4 py-3 rounded-2xl text-xs font-bold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-1.5 shadow-md hover:scale-105"
            >
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Backfill</span>
            </button>

            <button
              onClick={() => setEditModalOpen(true)}
              className="p-3 rounded-2xl text-slate-400 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition-colors shadow-md"
              title="Edit Habit"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleArchiveToggle}
              className="p-3 rounded-2xl text-slate-400 hover:text-amber-400 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition-colors shadow-md"
              title={habit.archived ? 'Restore Habit' : 'Archive Habit'}
            >
              {habit.archived ? <RotateCcw className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
            </button>

            <button
              onClick={handleDelete}
              className="p-3 rounded-2xl text-slate-400 hover:text-red-400 bg-slate-900/90 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 transition-colors shadow-md"
              title="Delete Habit"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Schedule & Telemetry Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Schedule:</span>
            <div className="flex gap-1.5 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
              {DAYS_OF_WEEK.map((d) => {
                const isScheduled =
                  habit.frequency?.type === 'daily' ||
                  (habit.frequency?.days || []).includes(d.id);
                return (
                  <span
                    key={d.id}
                    className={`w-7 h-7 rounded-lg text-[10px] font-black flex items-center justify-center ${
                      isScheduled
                        ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                        : 'bg-transparent text-slate-600'
                    }`}
                  >
                    {d.short}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 px-3.5 py-1.5 rounded-2xl shadow-sm">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-flame" />
              <div className="text-xs text-orange-300 font-medium">
                Current: <span className="font-black text-white text-sm">{habit.currentStreak || 0}d</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/25 px-3.5 py-1.5 rounded-2xl shadow-sm">
              <Award className="w-4 h-4 text-purple-400" />
              <div className="text-xs text-purple-300 font-medium">
                Longest: <span className="font-black text-white text-sm">{habit.longestStreak || 0}d</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub-style Heatmap */}
      <GitHubHeatmap heatmapData={heatmapData} habitColor={habit.color || '#06b6d4'} />

      {/* Milestone Badges */}
      <MilestoneBadges streak={habit.longestStreak || habit.currentStreak || 0} />

      {/* Recent Log History */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800/90 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-extrabold text-base text-white">Check-in Audit Logs</h3>
            <p className="text-xs text-slate-400">Chronological ledger of habit completions and notes</p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Showing {Math.min(logs.length, 15)} most recent entries
          </span>
        </div>

        {logs.length > 0 ? (
          <div className="divide-y divide-slate-800/80">
            {logs.slice(0, 15).map((log) => (
              <div
                key={log._id}
                className="py-3.5 flex items-center justify-between text-xs hover:bg-slate-900/40 px-3 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      log.completed
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                        : 'bg-slate-600'
                    }`}
                  />
                  <span className="font-bold text-slate-200">{log.date}</span>
                  {log.note && (
                    <span className="text-slate-400 italic truncate max-w-xs sm:max-w-md bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-800">
                      &ldquo;{log.note}&rdquo;
                    </span>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black ${
                    log.completed
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {log.completed ? 'Completed 🔥' : 'Skipped'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-xs text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800/50">
            <Activity className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            No check-in logs recorded yet. Complete today or backfill past days above!
          </div>
        )}
      </div>

      {/* Modals */}
      <HabitFormModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={habit}
      />

      <BackfillModal
        isOpen={backfillModalOpen}
        onClose={() => setBackfillModalOpen(false)}
        habit={habit}
        onCheckInSuccess={async (hId, date, note) => {
          await habitApi.checkIn(hId, { date, note });
          loadHabitData();
        }}
      />
    </div>
  );
}

