import React, { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Activity, Flame, Trophy, Calendar, Sparkles } from 'lucide-react';

export default function GitHubHeatmap({ heatmapData = [], habitColor = '#06b6d4' }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  const stats = useMemo(() => {
    if (!heatmapData || heatmapData.length === 0) {
      return { totalCompleted: 0, scheduledTotal: 0, adherence: 0 };
    }
    const completed = heatmapData.filter((d) => d.completed).length;
    const scheduled = heatmapData.filter((d) => d.scheduled).length;
    const adherence = scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0;
    return {
      totalCompleted: completed,
      scheduledTotal: scheduled,
      adherence,
    };
  }, [heatmapData]);

  if (!heatmapData || heatmapData.length === 0) {
    return (
      <div className="glass-card p-8 rounded-3xl border border-slate-800 text-center text-xs text-slate-500">
        <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-pulse" />
        No log history available for this habit yet.
      </div>
    );
  }

  // Organize 365 days into 7 rows (by day of week: Sun=0..Sat=6) and columns (weeks)
  const firstDay = heatmapData[0];
  const firstDayOfWeek = firstDay.dayOfWeek; // 0..6

  // Pad the start with empty slots if first day is not Sunday
  const paddedData = [...Array(firstDayOfWeek).fill(null), ...heatmapData];

  // Divide into weeks of 7 days
  const weeks = [];
  for (let i = 0; i < paddedData.length; i += 7) {
    weeks.push(paddedData.slice(i, i + 7));
  }

  // Calculate month labels at appropriate week intervals
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIndex) => {
    const validDay = week.find((d) => d !== null);
    if (validDay) {
      const month = parseISO(validDay.date).getMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          weekIndex,
          label: format(parseISO(validDay.date), 'MMM'),
        });
        lastMonth = month;
      }
    }
  });

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800/90 relative overflow-hidden shadow-2xl backdrop-blur-2xl">
      {/* Background ambient glow */}
      <div
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: habitColor }}
      />

      {/* Header and Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="font-extrabold text-base text-white">365-Day Activity Matrix</h3>
          </div>
          <p className="text-xs text-slate-400">Yearly consistency and ritual adherence matrix</p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs flex items-center gap-1.5 shadow-inner">
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
            <span className="font-black text-white">{stats.totalCompleted}</span>
            <span className="text-[10px] text-slate-400">check-ins</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs flex items-center gap-1.5 shadow-inner">
            <Trophy className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-black text-white">{stats.adherence}%</span>
            <span className="text-[10px] text-slate-400">rate</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[760px]">
          {/* Month Labels */}
          <div className="flex text-[10px] text-slate-400 font-semibold mb-2 ml-7">
            {weeks.map((_, weekIndex) => {
              const m = monthLabels.find((ml) => ml.weekIndex === weekIndex);
              return (
                <div key={weekIndex} className="w-3.5 mr-1 text-left flex-shrink-0">
                  {m ? m.label : ''}
                </div>
              );
            })}
          </div>

          <div className="flex">
            {/* Day of Week Labels */}
            <div className="flex flex-col justify-between text-[9px] text-slate-500 font-bold pr-2 select-none h-[112px] py-1">
              <span>Sun</span>
              <span>Tue</span>
              <span>Thu</span>
              <span>Sat</span>
            </div>

            {/* Week Columns */}
            <div className="flex gap-1.5">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1.5">
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return <div key={`empty-${dayIndex}`} className="w-3.5 h-3.5 rounded-sm opacity-0" />;
                    }

                    const isDone = day.completed;
                    const isScheduled = day.scheduled;

                    let cellClass = 'w-3.5 h-3.5 rounded-[4px] cursor-pointer transition-all duration-200 hover:scale-150 hover:z-20';
                    let customStyle = {};

                    if (isDone) {
                      cellClass += ' shadow-md';
                      customStyle = {
                        backgroundColor: habitColor,
                        boxShadow: `0 0 8px ${habitColor}70`,
                      };
                    } else if (isScheduled) {
                      cellClass += ' bg-slate-800/80 border border-slate-700/80 hover:border-slate-500';
                    } else {
                      cellClass += ' bg-slate-900/50 border border-slate-800/50 hover:border-slate-700';
                    }

                    return (
                      <div
                        key={day.date}
                        style={customStyle}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={cellClass}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legend and Interactive Tooltip Bar */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        {/* Dynamic Tooltip */}
        <div className="min-h-[28px] flex items-center">
          {hoveredDay ? (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 animate-fade-in">
              <span className="font-extrabold text-white text-xs">
                {format(parseISO(hoveredDay.date), 'EEEE, MMMM d, yyyy')}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                  hoveredDay.completed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : hoveredDay.scheduled
                    ? 'bg-slate-800 text-slate-300 border border-slate-700'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
              >
                {hoveredDay.completed
                  ? 'Completed 🔥'
                  : hoveredDay.scheduled
                  ? 'Scheduled (Missed)'
                  : 'Off Day'}
              </span>
              {hoveredDay.note && (
                <span className="text-slate-300 italic text-[11px] bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800">
                  &ldquo;{hoveredDay.note}&rdquo;
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-600" />
              Hover over any cell to inspect check-in timestamps and notes.
            </span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-[3px] bg-slate-900/60 border border-slate-800" />
            <span>Off Day</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-[3px] bg-slate-800/80 border border-slate-700" />
            <span>Missed</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-[3px] shadow-sm"
              style={{ backgroundColor: habitColor, boxShadow: `0 0 6px ${habitColor}60` }}
            />
            <span>Completed</span>
          </span>
        </div>
      </div>
    </div>
  );
}

