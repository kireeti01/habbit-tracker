import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';

export default function GitHubHeatmap({ heatmapData = [], habitColor = '#6366F1' }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  if (!heatmapData || heatmapData.length === 0) {
    return (
      <div className="glass-card p-6 rounded-2xl border border-slate-800 text-center text-xs text-slate-500">
        No log history available for this habit.
      </div>
    );
  }

  // Organize 365 days into 7 rows (by day of week: Sun=0..Sat=6) and columns (weeks)
  // First day in dataset
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
    <div className="glass-card p-6 rounded-2xl border border-slate-800 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-white">Yearly Activity Matrix</h3>
          <p className="text-xs text-slate-400">365-day consistency visualization</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-900 border border-slate-800" />
            <span>Off day</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-800/80 border border-slate-700" />
            <span>Missed</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm shadow-sm"
              style={{ backgroundColor: habitColor }}
            />
            <span>Completed</span>
          </span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="min-w-[720px]">
        {/* Month Labels */}
        <div className="flex text-[10px] text-slate-500 mb-1 ml-7">
          {weeks.map((_, weekIndex) => {
            const m = monthLabels.find((ml) => ml.weekIndex === weekIndex);
            return (
              <div key={weekIndex} className="w-3 mr-1 text-left flex-shrink-0">
                {m ? m.label : ''}
              </div>
            );
          })}
        </div>

        <div className="flex">
          {/* Day of Week Labels */}
          <div className="flex flex-col justify-between text-[9px] text-slate-500 pr-2 select-none h-[96px] py-0.5">
            <span>Sun</span>
            <span>Tue</span>
            <span>Thu</span>
            <span>Sat</span>
          </div>

          {/* Week Columns */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return <div key={`empty-${dayIndex}`} className="w-3 h-3 rounded-sm opacity-0" />;
                  }

                  const isDone = day.completed;
                  const isScheduled = day.scheduled;

                  let cellBg = 'bg-slate-900/60 border border-slate-800/60';
                  let customStyle = {};

                  if (isDone) {
                    customStyle = {
                      backgroundColor: habitColor,
                      boxShadow: `0 0 6px ${habitColor}40`,
                    };
                  } else if (isScheduled) {
                    cellBg = 'bg-slate-800/80 border border-slate-700/80';
                  }

                  return (
                    <div
                      key={day.date}
                      style={customStyle}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-transform hover:scale-125 hover:z-10 ${
                        !isDone ? cellBg : ''
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 min-h-[32px] text-xs flex items-center justify-between text-slate-400">
        {hoveredDay ? (
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white">
              {format(parseISO(hoveredDay.date), 'EEEE, MMMM d, yyyy')}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                hoveredDay.completed
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : hoveredDay.scheduled
                  ? 'bg-slate-800 text-slate-400'
                  : 'bg-slate-900 text-slate-500'
              }`}
            >
              {hoveredDay.completed
                ? 'Completed 🔥'
                : hoveredDay.scheduled
                ? 'Scheduled (Missed)'
                : 'Off Day'}
            </span>
            {hoveredDay.note && (
              <span className="text-slate-300 italic text-[11px]">Note: &ldquo;{hoveredDay.note}&rdquo;</span>
            )}
          </div>
        ) : (
          <span className="text-slate-500 text-[11px]">
            Hover over any day in the matrix to view details.
          </span>
        )}
      </div>
    </div>
  );
}
