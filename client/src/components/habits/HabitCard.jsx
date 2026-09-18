import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Check,
  MoreVertical,
  Edit2,
  Archive,
  Trash2,
  RotateCcw,
  Clock,
  Calendar,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { DAYS_OF_WEEK } from '../../utils/categoryColors';
import { format } from 'date-fns';

export default function HabitCard({
  habit,
  onCheckIn,
  onEdit,
  onArchive,
  onDelete,
  onOpenBackfill,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [checking, setChecking] = useState(false);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const isCompletedToday = !!habit.todayCompleted;
  const isScheduledToday = habit.todayScheduled !== false;
  const isAtRisk = habit.isAtRisk;

  const handleCheckClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (checking) return;
    setChecking(true);
    try {
      await onCheckIn(habit._id, todayStr);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div
      className={`glass-card rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:border-slate-700 ${
        isCompletedToday ? 'border-emerald-500/30' : 'border-slate-800'
      } ${habit.archived ? 'opacity-60 bg-slate-950/40' : ''}`}
    >
      {/* Top accent line */}
      <div
        className="h-1.5 w-full transition-all duration-500"
        style={{ backgroundColor: isCompletedToday ? '#10B981' : habit.color || '#6366F1' }}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm border border-white/5"
              style={{ backgroundColor: `${habit.color || '#6366F1'}20` }}
            >
              {habit.icon || '⚡'}
            </div>
            <div>
              <Link
                to={`/habits/${habit._id}`}
                className="font-bold text-base text-white hover:text-brand-400 transition-colors flex items-center gap-1 group-hover:translate-x-0.5"
              >
                <span>{habit.title}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-medium text-slate-400 capitalize px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                  {habit.category}
                </span>
                {habit.targetTime && (
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {habit.targetTime}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* More Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-30 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1 text-xs">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(habit);
                    }}
                    className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-brand-400" /> Edit Habit
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenBackfill(habit);
                    }}
                    className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Backfill Past Days
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onArchive(habit._id);
                    }}
                    className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                  >
                    {habit.archived ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5 text-emerald-400" /> Restore Habit
                      </>
                    ) : (
                      <>
                        <Archive className="w-3.5 h-3.5 text-amber-400" /> Archive Habit
                      </>
                    )}
                  </button>
                  <div className="my-1 border-t border-slate-800" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      if (window.confirm(`Permanently delete "${habit.title}" and all its logs?`)) {
                        onDelete(habit._id);
                      }
                    }}
                    className="w-full px-3 py-2 text-left text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Permanently
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description (if any) */}
        {habit.description && (
          <p className="text-xs text-slate-400 mb-4 line-clamp-2">{habit.description}</p>
        )}

        {/* Streak Stats & Schedule Grid */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg flex items-center gap-1 ${
                habit.currentStreak > 0
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              <Flame className={`w-4 h-4 ${habit.currentStreak > 0 ? 'text-orange-500 fill-orange-500' : ''}`} />
              <span className="font-extrabold text-xs">{habit.currentStreak || 0}</span>
              <span className="text-[10px] font-medium opacity-80">streak</span>
            </div>

            {isAtRisk && (
              <span
                title="Streak at risk! Complete today to maintain your momentum."
                className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 text-[10px] font-bold animate-pulse"
              >
                <AlertTriangle className="w-3 h-3" /> At Risk
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-400">
            Best: <span className="font-semibold text-slate-200">{habit.longestStreak || 0} days</span>
          </div>
        </div>

        {/* Schedule Day Pills */}
        <div className="flex items-center justify-between mb-4 bg-slate-950/40 p-1.5 rounded-xl border border-slate-900">
          {DAYS_OF_WEEK.map((d) => {
            const isScheduled =
              habit.frequency?.type === 'daily' || (habit.frequency?.days || []).includes(d.id);
            const isToday = new Date().getDay() === d.id;

            return (
              <div
                key={d.id}
                title={`${d.label}: ${isScheduled ? 'Scheduled' : 'Off day'}`}
                className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center transition-all ${
                  isToday
                    ? 'ring-1 ring-brand-400 bg-brand-500/20 text-brand-300'
                    : isScheduled
                    ? 'text-slate-300 bg-slate-800/60'
                    : 'text-slate-600 bg-transparent'
                }`}
              >
                {d.short}
              </div>
            );
          })}
        </div>

        {/* 1-Click Today Check-in Button */}
        <button
          type="button"
          disabled={checking || habit.archived}
          onClick={handleCheckClick}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${
            isCompletedToday
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
              : isScheduledToday
              ? 'bg-slate-900 hover:bg-brand-600 text-slate-300 hover:text-white border border-slate-800 hover:border-brand-500'
              : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 border border-slate-800/60'
          } disabled:opacity-40`}
        >
          {checking ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : isCompletedToday ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Completed Today</span>
            </>
          ) : isScheduledToday ? (
            <>
              <div className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
              <span>Mark Today Complete</span>
            </>
          ) : (
            <span>Optional Check-in (Off Day)</span>
          )}
        </button>
      </div>
    </div>
  );
}
