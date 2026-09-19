import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-2xl bg-[#090e1c]/95 border border-cyan-500/40 p-3.5 text-xs shadow-2xl backdrop-blur-xl space-y-1.5 min-w-[150px]">
        <p className="font-extrabold text-white flex items-center justify-between">
          <span>{data.dayName}</span>
          <span className="text-[10px] text-slate-400 font-normal">{data.date}</span>
        </p>
        <div className="flex items-center justify-between text-emerald-400 font-bold text-xs pt-1 border-t border-slate-800">
          <span>Completed:</span>
          <span>{data.completed} / {data.scheduled} habits</span>
        </div>
        <div className="flex items-center justify-between text-cyan-300 font-extrabold text-xs">
          <span>Adherence:</span>
          <span>{data.rate}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function WeeklyCompletionChart({ data = [], loading = false }) {
  if (loading) {
    return <div className="h-64 rounded-3xl bg-slate-900/60 border border-slate-800/80 animate-pulse" />;
  }

  return (
    <div className="rounded-3xl bg-[#0c1322]/85 border border-slate-800/80 p-6 flex flex-col justify-between shadow-xl backdrop-blur-xl hover:border-slate-700/80 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <span>Weekly Adherence</span>
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              7-Day
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Daily completion percentage over the last 7 days</p>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-sm">
          <TrendingUp className="w-4 h-4" />
        </div>
      </div>

      <div className="h-56 w-full pt-2">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.6} />
              <XAxis
                dataKey="dayName"
                stroke="#64748b"
                fontSize={11}
                fontWeight={600}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                unit="%"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
              <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.rate >= 80
                        ? '#10b981' // Emerald
                        : entry.rate >= 50
                        ? '#06b6d4' // Cyan
                        : entry.rate > 0
                        ? '#f59e0b' // Amber
                        : '#1e293b' // Dark empty
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-500">
            No check-in activity recorded in the last 7 days.
          </div>
        )}
      </div>
    </div>
  );
}

