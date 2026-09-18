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
} from 'lucide-react';
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
    try {
      await habitApi.checkIn(id, { date: todayStr });
      toast.success('Updated today’s check-in');
      loadHabitData();
    } catch (err) {
      toast.error('Check-in failed');
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
      <div className="py-20 flex justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!habit) return null;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/habits"
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Habits</span>
      </Link>

      {/* Habit Header Card */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: habit.color || '#6366F1' }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/10"
              style={{ backgroundColor: `${habit.color || '#6366F1'}25` }}
            >
              {habit.icon || '⚡'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 capitalize">
                  {habit.category}
                </span>
                {habit.targetTime && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {habit.targetTime}
                  </span>
                )}
                {habit.archived && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Archived
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{habit.title}</h1>
              {habit.description && (
                <p className="text-sm text-slate-400 mt-1 max-w-2xl">{habit.description}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCheckInToday}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                habit.todayCompleted
                  ? 'bg-emerald-500 text-slate-950 font-extrabold hover:bg-emerald-400'
                  : 'bg-brand-600 hover:bg-brand-500 text-white'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{habit.todayCompleted ? 'Completed Today' : 'Check-in Today'}</span>
            </button>
            <button
              onClick={() => setBackfillModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Backfill</span>
            </button>
            <button
              onClick={() => setEditModalOpen(true)}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Edit Habit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleArchiveToggle}
              className="p-2.5 rounded-xl text-slate-400 hover:text-amber-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              title={habit.archived ? 'Restore Habit' : 'Archive Habit'}
            >
              {habit.archived ? <RotateCcw className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDelete}
              className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              title="Delete Habit"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Schedule Strip */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Scheduled:</span>
            <div className="flex gap-1">
              {DAYS_OF_WEEK.map((d) => {
                const isScheduled =
                  habit.frequency?.type === 'daily' ||
                  (habit.frequency?.days || []).includes(d.id);
                return (
                  <span
                    key={d.id}
                    className={`w-6 h-6 rounded-md text-[10px] font-bold flex items-center justify-center ${
                      isScheduled ? 'bg-slate-800 text-slate-200' : 'bg-transparent text-slate-600'
                    }`}
                  >
                    {d.short}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div>
              Current Streak:{' '}
              <span className="font-extrabold text-orange-400 text-sm">{habit.currentStreak || 0}d 🔥</span>
            </div>
            <div>
              Best Streak:{' '}
              <span className="font-bold text-white text-sm">{habit.longestStreak || 0}d</span>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub-style Heatmap */}
      <GitHubHeatmap heatmapData={heatmapData} habitColor={habit.color || '#6366F1'} />

      {/* Milestone Badges */}
      <MilestoneBadges streak={habit.longestStreak || habit.currentStreak || 0} />

      {/* Recent Log History */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <h3 className="font-bold text-base text-white mb-1">Check-in History</h3>
        <p className="text-xs text-slate-400 mb-4">Chronological log entries for this habit</p>

        {logs.length > 0 ? (
          <div className="divide-y divide-slate-800/80">
            {logs.slice(0, 15).map((log) => (
              <div key={log._id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      log.completed ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <span className="font-semibold text-slate-200">{log.date}</span>
                  {log.note && (
                    <span className="text-slate-400 italic truncate max-w-xs sm:max-w-md">
                      &ldquo;{log.note}&rdquo;
                    </span>
                  )}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    log.completed
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {log.completed ? 'Completed' : 'Skipped'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">No logs recorded yet.</div>
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
