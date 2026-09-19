import React from 'react';
import confetti from 'canvas-confetti';
import { Award, Lock, Sparkles, Trophy } from 'lucide-react';

export const MILESTONES = [
  { days: 7, title: 'Week Warrior', icon: '🥉', desc: '7-day streak conquered', border: 'border-amber-500/40', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]' },
  { days: 30, title: 'Habit Master', icon: '🥈', desc: '30 consecutive days', border: 'border-cyan-400/50', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]' },
  { days: 100, title: 'Century Forge', icon: '🥇', desc: '100 days of relentless forge', border: 'border-orange-500/50', glow: 'shadow-[0_0_25px_rgba(249,115,22,0.3)]' },
  { days: 365, title: 'Unstoppable Legend', icon: '👑', desc: '1 entire year of mastery', border: 'border-purple-500/60', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.4)]' },
];

export const triggerCelebration = () => {
  confetti({
    particleCount: 90,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#06b6d4', '#f97316', '#10b981', '#a855f7'],
  });
};

export default function MilestoneBadges({ streak = 0, title = 'Streak Milestone Badges' }) {
  const handleBadgeClick = (isUnlocked) => {
    if (isUnlocked) {
      triggerCelebration();
    }
  };

  return (
    <div className="rounded-3xl bg-[#0c1322]/85 border border-slate-800/80 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
            <span>{title}</span>
            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
              Trophy Hall
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Unlock prestigious 3D milestone trophies as your active streaks evolve</p>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm">
          <Trophy className="w-5 h-5 text-amber-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {MILESTONES.map((m) => {
          const isUnlocked = streak >= m.days;
          return (
            <button
              key={m.days}
              type="button"
              onClick={() => handleBadgeClick(isUnlocked)}
              className={`p-5 rounded-2xl border text-center transition-all duration-300 relative overflow-hidden group ${
                isUnlocked
                  ? `bg-gradient-to-b from-[#111c33] to-[#0a1020] ${m.border} ${m.glow} hover:-translate-y-1.5 hover:scale-105 cursor-pointer`
                  : 'bg-[#090e1c]/40 border-slate-800/80 opacity-40 cursor-default'
              }`}
            >
              {/* Unlocked top glow line */}
              {isUnlocked && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-cyan-400 to-purple-400" />
              )}

              <div className="text-4xl mb-3 flex items-center justify-center">
                {isUnlocked ? (
                  <span className="transform transition-transform group-hover:scale-125 group-hover:rotate-6 duration-300">
                    {m.icon}
                  </span>
                ) : (
                  <div className="relative">
                    <span className="grayscale opacity-40">{m.icon}</span>
                    <Lock className="w-4 h-4 text-slate-400 absolute inset-0 m-auto" />
                  </div>
                )}
              </div>

              <div className="font-black text-xs sm:text-sm text-white mb-0.5 tracking-tight">{m.title}</div>
              <div className="text-[11px] text-slate-400 mb-3">{m.days} Days Streak</div>

              <div className="text-[10px] font-bold">
                {isUnlocked ? (
                  <span className="text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" /> Unlocked
                  </span>
                ) : (
                  <span className="text-slate-500 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                    {m.days - streak}d remaining
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

