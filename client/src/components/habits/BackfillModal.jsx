import React, { useState, useEffect } from 'react';
import { X, Calendar, Check, AlertCircle, Sparkles, Flame } from 'lucide-react';
import { format, subDays, parseISO } from 'date-fns';
import { habitApi } from '../../api/habitApi';
import toast from 'react-hot-toast';

export default function BackfillModal({ isOpen, onClose, habit, onCheckInSuccess }) {
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeDate, setActiveDate] = useState(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Generate last 7 days dates array
  const today = new Date();
  const pastDays = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(today, i + 1);
    return {
      dateStr: format(d, 'yyyy-MM-dd'),
      displayDay: format(d, 'EEEE, MMM d'),
      relative: i === 0 ? 'Yesterday' : `${i + 1} days ago`,
    };
  });

  useEffect(() => {
    if (isOpen && habit) {
      setLoading(true);
      const minDate = pastDays[pastDays.length - 1].dateStr;
      const maxDate = pastDays[0].dateStr;

      habitApi
        .getLogs(habit._id, { from: minDate, to: maxDate })
        .then((res) => {
          const map = {};
          (res.data || []).forEach((l) => {
            map[l.date] = l;
          });
          setLogs(map);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen, habit]);

  if (!isOpen || !habit) return null;

  const handleToggleDate = async (dateStr) => {
    setSubmitting(true);
    try {
      const isCurrentlyCompleted = !!logs[dateStr]?.completed;
      await onCheckInSuccess(habit._id, dateStr, note);
      setLogs((prev) => ({
        ...prev,
        [dateStr]: {
          ...prev[dateStr],
          date: dateStr,
          completed: !isCurrentlyCompleted,
          note,
        },
      }));
      toast.success(!isCurrentlyCompleted ? `Logged for ${dateStr} 🔥` : `Unchecked for ${dateStr}`);
      setActiveDate(null);
      setNote('');
    } catch (err) {
      toast.error('Failed to log past date');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="glass-card w-full max-w-md rounded-3xl border border-slate-700/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 sm:p-7 relative backdrop-blur-2xl">
        {/* Accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5 shadow-lg"
          style={{
            backgroundColor: habit.color || '#a855f7',
            boxShadow: `0 0 15px ${habit.color || '#a855f7'}80`,
          }}
        />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div
            className="text-2xl p-2.5 rounded-2xl border border-white/10 shadow-md"
            style={{ backgroundColor: `${habit.color || '#a855f7'}25` }}
          >
            {habit.icon || '⚡'}
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Backfill Past Days</h2>
            <p className="text-xs text-slate-400">7-day retrospective check-in grace window</p>
          </div>
        </div>

        {loading ? (
          <div className="py-10 flex flex-col items-center justify-center gap-2">
            <div className="w-7 h-7 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-500">Scanning historical logs...</span>
          </div>
        ) : (
          <div className="space-y-2.5 mt-4">
            {pastDays.map(({ dateStr, displayDay, relative }) => {
              const isDone = !!logs[dateStr]?.completed;
              return (
                <div
                  key={dateStr}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    isDone
                      ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                      : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white">{displayDay}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{relative}</div>
                  </div>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleToggleDate(dateStr)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 hover:brightness-110 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Completed 🔥</span>
                      </>
                    ) : (
                      <span>Mark Done</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors shadow-md"
          >
            Close & Save
          </button>
        </div>
      </div>
    </div>
  );
}

