import React from 'react';
import { Flame, Zap, CheckCircle, ShieldCheck, Trophy, Sparkles } from 'lucide-react';

const LIVE_EVENTS = [
  { user: 'Sarah C. (San Francisco)', text: 'Completed Day 45 of Mindful Meditation', icon: Flame, color: 'text-orange-400' },
  { user: 'Marcus V. (Berlin)', text: 'Unlocked 100-Day Diamond Streak League', icon: Trophy, color: 'text-amber-400' },
  { user: 'Alex R. (Tokyo)', text: 'Protected 60-Day Streak across Timezones', icon: ShieldCheck, color: 'text-cyan-400' },
  { user: 'Elena P. (London)', text: 'Achieved 2h Deep Code Sprint (28-day streak)', icon: Zap, color: 'text-purple-400' },
  { user: 'David K. (New York)', text: 'Generated New 30-Day Marathon Roadmap with AI', icon: Sparkles, color: 'text-cyan-300' },
  { user: 'Priya N. (Toronto)', text: 'Logged 10,000 Steps Goal (+150 XP)', icon: CheckCircle, color: 'text-emerald-400' },
];

export default function LiveMomentumTicker() {
  const events = [...LIVE_EVENTS, ...LIVE_EVENTS];

  return (
    <div className="w-full bg-[#050811]/90 border-y border-slate-800/80 py-3 overflow-hidden select-none">
      <div className="animate-ticker flex items-center gap-6">
        {events.map((event, idx) => {
          const Icon = event.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/80 shadow-md text-xs whitespace-nowrap"
            >
              <Icon className={`w-3.5 h-3.5 ${event.color} shrink-0 animate-pulse`} />
              <span className="font-semibold text-slate-200">{event.user}</span>
              <span className="text-slate-400">{event.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
