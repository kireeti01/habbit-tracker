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
  Sparkles,
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
      className={`rounded-3xl border transition-all duration-300 relative overflow-hidden group shadow-xl backdrop-blur-xl ${
        isCompletedToday
          ? 'bg-[#0c1822]/90 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)] hover:border-emerald-400'
          : 'bg-[#0c1322]/85 border-slate-800/90 hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] hover:-translate-y-1'
      } ${habit.archived ? 'opacity-50 bg-slate-950/40' : ''}`}
    >
      {/* Top accent glowing line */}
      <div
        className="h-1.5 w-full transition-all duration-500"
        style={{
          backgroundColor: isCompletedToday ? '#10b981' : habit.color || '#06b6d4',
          boxShadow: isCompletedToday ? '0 0 10px rgba(16,185,129,0.5)' : `0 0 10px ${habit.color || '#06b6d4'}40`,
        }}
      />

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md border border-white/10 transition-transform group-hover:scale-105"
              style={{ backgroundColor: `${habit.color || '#06b6d4'}25` }}
            >
              {habit.icon || '⚡'}
            </div>
            <div>
              <Link
                to={`/habits/${habit._id}`}
                className="font-extrabold text-base text-white hover:text-cyan-400 transition-colors flex items-center gap-1 group-hover:translate-x-0.5"
              >
                <span>{habit.title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-slate-300 capitalize px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                  {habit.category}
                </span>
                {habit.targetTime && (
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
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
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-30 w-48 rounded-2xl bg-[#090e1c] border border-slate-700/80 shadow-2xl py-1.5 text-xs backdrop-blur-xl">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(habit);
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-cyan-400" /> Edit Habit
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenBackfill(habit);
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Calendar className="w-3.5 h-3.5 text-purple-400" /> Backfill Past Days
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onArchive(habit._id);
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
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
                    className="w-full px-3.5 py-2 text-left text-red-400 hover:bg-red-500/15 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Permanently
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {habit.description && (
          <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">{habit.description}</p>
        )}

        {/* Streak Stats & Schedule Grid */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`px-2.5 py-1 rounded-xl flex items-center gap-1.5 ${
                habit.currentStreak > 0
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/25 shadow-sm'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              <Flame className={`w-4 h-4 ${habit.currentStreak > 0 ? 'text-orange-400 fill-orange-400 animate-flame' : ''}`} />
              <span className="font-black text-xs">{habit.currentStreak || 0}</span>
              <span className="text-[10px] font-semibold opacity-80">streak</span>
            </div>

            {isAtRisk && (
              <span
                title="Streak at risk! Complete today to maintain your momentum."
                className="px-2 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center gap-1 text-[10px] font-bold animate-pulse"
              >
                <AlertTriangle className="w-3 h-3" /> At Risk
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            Best: <span className="font-extrabold text-white">{habit.longestStreak || 0}d</span>
          </div>
        </div>

        {/* Schedule Day Pills */}
        <div className="flex items-center justify-between mb-4 bg-slate-950/60 p-2 rounded-2xl border border-slate-800/80">
          {DAYS_OF_WEEK.map((d) => {
            const isScheduled =
              habit.frequency?.type === 'daily' || (habit.frequency?.days || []).includes(d.id);
            const isToday = new Date().getDay() === d.id;

            return (
              <div
                key={d.id}
                title={`${d.label}: ${isScheduled ? 'Scheduled' : 'Off day'}`}
                className={`w-7 h-7 rounded-xl text-[10px] font-black flex items-center justify-center transition-all ${
                  isToday
                    ? 'ring-1 ring-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : isScheduled
                    ? 'text-slate-200 bg-slate-800/80'
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
          className={`w-full py-3 px-4 rounded-2xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
            isCompletedToday
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              : isScheduledToday
              ? 'bg-slate-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 text-slate-200 hover:text-white border border-slate-800 hover:border-cyan-400/50 hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 border border-slate-800/60'
          } disabled:opacity-40`}
        >
          {checking ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : isCompletedToday ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Completed Today 🔥</span>
            </>
          ) : isScheduledToday ? (
            <>
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
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

