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
import { TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-card p-3 rounded-xl border border-slate-700 text-xs shadow-xl space-y-1">
        <p className="font-bold text-white">{data.dayName} ({data.date})</p>
        <p className="text-emerald-400 font-semibold">
          Completed: {data.completed} / {data.scheduled} habits
        </p>
        <p className="text-brand-300">Completion Rate: {data.rate}%</p>
      </div>
    );
  }
  return null;
};

export default function WeeklyCompletionChart({ data = [], loading = false }) {
  if (loading) {
    return <div className="glass-card h-64 rounded-2xl border border-slate-800 animate-pulse" />;
  }

  return (
    <div className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-white">Weekly Performance</h3>
          <p className="text-xs text-slate-400">Daily completion rate over the last 7 days</p>
        </div>
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <TrendingUp className="w-4 h-4" />
        </div>
      </div>

      <div className="h-56 w-full">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.4} />
              <XAxis
                dataKey="dayName"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                unit="%"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
              <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.rate >= 80
                        ? '#10B981' // Emerald
                        : entry.rate >= 50
                        ? '#6366F1' // Indigo
                        : entry.rate > 0
                        ? '#F59E0B' // Amber
                        : '#334155' // Slate empty
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
