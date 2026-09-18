import React from 'react';
import { Flame, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/60 py-8 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="font-semibold text-slate-400">StreakForge</span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <p className="flex items-center gap-1">
          Forged for relentless habit mastery and daily momentum.
        </p>
      </div>
    </footer>
  );
}
