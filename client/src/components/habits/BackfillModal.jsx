import React, { useState, useEffect } from 'react';
import { X, Calendar, Check, AlertCircle } from 'lucide-react';
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
      displayDay: format(d, 'EEE, MMM d'),
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
      const res = await onCheckInSuccess(habit._id, dateStr, note);
      setLogs((prev) => ({
        ...prev,
        [dateStr]: {
          ...prev[dateStr],
          date: dateStr,
          completed: !isCurrentlyCompleted,
          note,
        },
      }));
      toast.success(!isCurrentlyCompleted ? `Logged for ${dateStr}` : `Unchecked for ${dateStr}`);
      setActiveDate(null);
      setNote('');
    } catch (err) {
      toast.error('Failed to log past date');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-md rounded-2xl border border-slate-800 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800">{habit.icon}</div>
          <div>
            <h2 className="text-lg font-bold text-white">Backfill Past Days</h2>
            <p className="text-xs text-slate-400">Log missed days within the 7-day grace window</p>
          </div>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-2 mt-4">
            {pastDays.map(({ dateStr, displayDay, relative }) => {
              const isDone = !!logs[dateStr]?.completed;
              return (
                <div
                  key={dateStr}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                    isDone
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold">{displayDay}</div>
                    <div className="text-[11px] text-slate-500">{relative}</div>
                  </div>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleToggleDate(dateStr)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Completed</span>
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
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
