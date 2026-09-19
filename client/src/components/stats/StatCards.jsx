import React from 'react';
import { Flame, CheckSquare, TrendingUp, Award, Zap } from 'lucide-react';

export default function StatCards({ stats, loading = false }) {
  const cards = [
    {
      title: 'Total Habits',
      value: stats?.totalHabits ?? 0,
      subtext: `${stats?.todayTotalScheduled ?? 0} scheduled today`,
      icon: CheckSquare,
      color: 'text-cyan-400',
      glow: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:border-cyan-500/50',
      bg: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400',
      accent: 'from-cyan-500 to-blue-600',
    },
    {
      title: 'Active Streaks',
      value: stats?.activeStreaks ?? 0,
      subtext: 'Habits on fire 🔥',
      icon: Flame,
      color: 'text-orange-400',
      glow: 'hover:shadow-[0_0_25px_rgba(249,115,22,0.25)] hover:border-orange-500/50',
      bg: 'bg-orange-500/10 border-orange-500/25 text-orange-400',
      accent: 'from-orange-500 to-amber-500',
      isFlame: true,
    },
    {
      title: '7-Day Rate',
      value: `${stats?.completionRate7d ?? 0}%`,
      subtext: `30d average: ${stats?.completionRate30d ?? 0}%`,
      icon: TrendingUp,
      color: 'text-emerald-400',
      glow: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:border-emerald-500/50',
      bg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
      accent: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Longest Record',
      value: `${stats?.bestStreak ?? 0}d`,
      subtext: 'All-time best streak',
      icon: Award,
      color: 'text-purple-400',
      glow: 'hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] hover:border-purple-500/50',
      bg: 'bg-purple-500/10 border-purple-500/25 text-purple-400',
      accent: 'from-purple-500 to-pink-500',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-3xl bg-slate-900/60 border border-slate-800/80 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative rounded-3xl bg-[#0c1322]/85 border border-slate-800/90 p-5 sm:p-6 transition-all duration-300 ${card.glow} hover:-translate-y-1.5 shadow-xl backdrop-blur-xl group overflow-hidden`}
          >
            {/* Top gradient line */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accent} opacity-60 group-hover:opacity-100 transition-opacity`} />

            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl border ${card.bg} transition-transform group-hover:scale-110`}>
                <Icon className={`w-4 h-4 ${card.isFlame ? 'animate-flame fill-orange-400' : ''}`} />
              </div>
            </div>

            <div className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-1.5">
              {card.value}
            </div>
            <div className="text-xs text-slate-400 truncate font-medium">{card.subtext}</div>
          </div>
        );
      })}
    </div>
  );
}

