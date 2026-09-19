import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, Trophy, Calendar as CalendarIcon, Play, RefreshCw, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AnimatedStreakHeatmap() {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [isWaving, setIsWaving] = useState(false);
  const [matrix, setMatrix] = useState([]);

  // Generate realistic 16-week matrix (16 cols x 7 days = 112 cells)
  useEffect(() => {
    generateInitialMatrix();
  }, []);

  const generateInitialMatrix = () => {
    const cols = 16;
    const rows = 7;
    const cells = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let c = 0; c < cols; c++) {
      const colCells = [];
      for (let r = 0; r < rows; r++) {
        // More active towards the recent weeks
        const recentBias = c / cols;
        const rand = Math.random();
        let level = 0;
        if (rand < 0.15) level = 0;
        else if (rand < 0.4) level = 1;
        else if (rand < 0.7) level = 2;
        else level = recentBias > 0.4 ? 4 : 3;

        colCells.push({
          id: `${c}-${r}`,
          col: c,
          row: r,
          day: days[r],
          week: c + 1,
          level: level,
          count: level === 0 ? 0 : level === 1 ? 1 : level === 2 ? 2 : level === 3 ? 4 : 5,
        });
      }
      cells.push(colCells);
    }
    setMatrix(cells);
  };

  const triggerWaveAnimation = () => {
    if (isWaving) return;
    setIsWaving(true);

    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#a855f7'],
    });

    setTimeout(() => {
      setIsWaving(false);
    }, 2500);
  };

  const getLevelColor = (level, isWaveActive, colIndex) => {
    if (isWaveActive) {
      return 'bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] scale-110 border-cyan-300';
    }
    switch (level) {
      case 0:
        return 'bg-slate-900/90 border-slate-800/80 hover:border-slate-600';
      case 1:
        return 'bg-emerald-950/80 border-emerald-900/60 hover:border-emerald-500';
      case 2:
        return 'bg-emerald-800/70 border-emerald-700/60 hover:border-emerald-400';
      case 3:
        return 'bg-emerald-600/80 border-emerald-500/70 hover:border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.2)]';
      case 4:
        return 'bg-emerald-400 border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.45)]';
      default:
        return 'bg-slate-900';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-[#0b1220]/90 border border-slate-800/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>GitHub-Style Year Matrix</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Visualize 365 Days of Relentless Momentum
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Hover over any day square or simulate our milestone ripple wave.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerWaveAnimation}
            disabled={isWaving}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isWaving ? 'Simulating...' : 'Ignite Wave'}</span>
          </button>
          <button
            onClick={generateInitialMatrix}
            title="Randomize Matrix"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Matrix Display */}
      <div className="py-6 overflow-x-auto">
        <div className="min-w-[620px] flex gap-1.5 items-center justify-between">
          {matrix.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-1.5 flex-1">
              {col.map((cell) => {
                const waveActive =
                  isWaving &&
                  Math.abs(colIdx - Math.floor((Date.now() / 80) % matrix.length)) < 2;
                return (
                  <div
                    key={cell.id}
                    onMouseEnter={() => setHoveredDay(cell)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`aspect-square rounded-[5px] border transition-all duration-200 cursor-pointer ${getLevelColor(
                      cell.level,
                      waveActive,
                      colIdx
                    )}`}
                    style={{
                      transitionDelay: isWaving ? `${colIdx * 45}ms` : '0ms',
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Matrix Legend & Tooltip Summary */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span>Less Active</span>
          <div className="flex items-center gap-1">
            <div className="w-3.5 h-3.5 rounded-[3px] bg-slate-900 border border-slate-800" />
            <div className="w-3.5 h-3.5 rounded-[3px] bg-emerald-950 border border-emerald-900" />
            <div className="w-3.5 h-3.5 rounded-[3px] bg-emerald-800 border border-emerald-700" />
            <div className="w-3.5 h-3.5 rounded-[3px] bg-emerald-600 border border-emerald-500" />
            <div className="w-3.5 h-3.5 rounded-[3px] bg-emerald-400 border border-emerald-300" />
          </div>
          <span>More Active</span>
        </div>

        {/* Hovered Day Details */}
        <div className="min-h-[22px] font-medium text-slate-200">
          {hoveredDay ? (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <strong className="text-white">{hoveredDay.day}, Week {hoveredDay.week}:</strong>{' '}
              {hoveredDay.count} {hoveredDay.count === 1 ? 'Habit' : 'Habits'} completed ({hoveredDay.level * 25}%)
            </span>
          ) : (
            <span className="text-slate-500">Hover over any day tile to inspect adherence</span>
          )}
        </div>
      </div>

      {/* Quick Metrics Bar at bottom */}
      <div className="mt-6 pt-6 border-t border-slate-800/60 grid grid-cols-3 gap-4 text-center">
        <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800/60">
          <div className="text-xs text-slate-400 font-medium">Current Streak</div>
          <div className="text-lg sm:text-xl font-black text-orange-400 flex items-center justify-center gap-1 mt-0.5">
            <Flame className="w-4 h-4 fill-orange-400 animate-flame" />
            <span>45 Days</span>
          </div>
        </div>
        <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800/60">
          <div className="text-xs text-slate-400 font-medium">Yearly Consistency</div>
          <div className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5">92.4%</div>
        </div>
        <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800/60">
          <div className="text-xs text-slate-400 font-medium">Total Completions</div>
          <div className="text-lg sm:text-xl font-black text-cyan-400 mt-0.5">412 Rituals</div>
        </div>
      </div>
    </div>
  );
}
