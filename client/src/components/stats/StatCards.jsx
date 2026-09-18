import React from 'react';
import { Flame, CheckSquare, TrendingUp, Award } from 'lucide-react';

export default function StatCards({ stats, loading = false }) {
  const cards = [
    {
      title: 'Total Habits',
      value: stats?.totalHabits ?? 0,
      subtext: `${stats?.todayTotalScheduled ?? 0} scheduled today`,
      icon: CheckSquare,
      color: 'text-brand-400',
      bg: 'bg-brand-500/10',
      border: 'border-brand-500/20',
    },
    {
      title: 'Active Streaks',
      value: stats?.activeStreaks ?? 0,
      subtext: 'Habits on fire 🔥',
      icon: Flame,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
    {
      title: '7-Day Completion',
      value: `${stats?.completionRate7d ?? 0}%`,
      subtext: `30d average: ${stats?.completionRate30d ?? 0}%`,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      title: 'Longest Record',
      value: `${stats?.bestStreak ?? 0}d`,
      subtext: 'All-time best streak',
      icon: Award,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card h-28 rounded-2xl border border-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.bg} ${card.color} border ${card.border}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
              {card.value}
            </div>
            <div className="text-[11px] text-slate-400 truncate">{card.subtext}</div>
          </div>
        );
      })}
    </div>
  );
}
