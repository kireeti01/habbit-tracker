import React from 'react';
import confetti from 'canvas-confetti';
import { Award, Lock, Sparkles } from 'lucide-react';

export const MILESTONES = [
  { days: 7, title: 'Week Warrior', icon: '🥉', desc: '7-day streak conquered', color: 'from-amber-600 to-amber-800' },
  { days: 30, title: 'Habit Master', icon: '🥈', desc: '30 consecutive days', color: 'from-slate-400 to-slate-600' },
  { days: 100, title: 'Century Forge', icon: '🥇', desc: '100 days of relentless forge', color: 'from-amber-400 to-orange-500' },
  { days: 365, title: 'Unstoppable Legend', icon: '👑', desc: '1 entire year of mastery', color: 'from-indigo-400 via-purple-500 to-pink-500' },
];

export const triggerCelebration = () => {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#6366F1', '#F59E0B', '#10B981', '#EC4899'],
  });
};

export default function MilestoneBadges({ streak = 0, title = 'Streak Milestone Badges' }) {
  const handleBadgeClick = (isUnlocked, badgeTitle) => {
    if (isUnlocked) {
      triggerCelebration();
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-white">{title}</h3>
          <p className="text-xs text-slate-400">Unlock prestigious badges as your streaks evolve</p>
        </div>
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Award className="w-4 h-4" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {MILESTONES.map((m) => {
          const isUnlocked = streak >= m.days;
          return (
            <button
              key={m.days}
              type="button"
              onClick={() => handleBadgeClick(isUnlocked, m.title)}
              className={`p-4 rounded-xl border text-center transition-all relative overflow-hidden group ${
                isUnlocked
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/30 hover:border-amber-400 hover:scale-105 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-40 cursor-default'
              }`}
            >
              <div className="text-3xl mb-2 flex items-center justify-center">
                {isUnlocked ? (
                  <span className="group-hover:animate-bounce">{m.icon}</span>
                ) : (
                  <div className="relative">
                    <span className="grayscale opacity-50">{m.icon}</span>
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute inset-0 m-auto" />
                  </div>
                )}
              </div>

              <div className="font-bold text-xs text-white mb-0.5">{m.title}</div>
              <div className="text-[10px] text-slate-400 mb-2">{m.days} Days</div>

              <div className="text-[9px] font-semibold">
                {isUnlocked ? (
                  <span className="text-amber-400 flex items-center justify-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Unlocked
                  </span>
                ) : (
                  <span className="text-slate-500">{m.days - streak}d remaining</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
