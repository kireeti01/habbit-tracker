import React, { useState } from 'react';
import {
  Flame,
  Check,
  ChevronRight,
  Bell,
  Menu,
  BookOpen,
  Dumbbell,
  Heart,
  Coffee,
  Clock,
  Home,
  Calendar,
  Sparkles,
  Zap,
  Star,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HeroPhoneMockup() {
  const [weekDays, setWeekDays] = useState([
    { label: 'M', checked: true },
    { label: 'T', checked: true },
    { label: 'W', checked: true },
    { label: 'T', checked: true },
    { label: 'F', checked: true },
    { label: 'S', checked: true },
    { label: 'S', checked: true },
  ]);

  const [habits, setHabits] = useState([
    {
      id: 'meditate',
      title: 'Meditate Daily',
      subtitle: 'Day 45',
      completed: true,
      active: true,
      progress: 100,
      color: 'cyan',
    },
    {
      id: 'read',
      title: 'Read 30 mins',
      subtitle: 'Day 28',
      completed: true,
      active: false,
      progress: 75,
      progressColor: 'from-amber-500 to-orange-500',
      icon: BookOpen,
    },
    {
      id: 'exercise',
      title: 'Exercise',
      subtitle: 'Day 19',
      completed: true,
      active: false,
      progress: 60,
      progressColor: 'from-emerald-400 to-teal-500',
      icon: Dumbbell,
    },
  ]);

  const [activeCategory, setActiveCategory] = useState(0);
  const [activeNav, setActiveNav] = useState('home');
  const [streakCount, setStreakCount] = useState(45);

  const toggleDay = (index) => {
    setWeekDays((prev) =>
      prev.map((day, i) => (i === index ? { ...day, checked: !day.checked } : day))
    );
  };

  const toggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const nextState = !h.completed;
          if (nextState) {
            triggerConfetti();
          }
          return { ...h, completed: nextState };
        }
        return h;
      })
    );
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6, x: 0.75 },
      colors: ['#06b6d4', '#a855f7', '#10b981', '#f59e0b'],
    });
  };

  const handleStreakClick = () => {
    setStreakCount((prev) => prev + 1);
    triggerConfetti();
  };

  const categories = [
    { icon: BookOpen, color: 'text-cyan-400', border: 'border-cyan-500/60', glow: 'shadow-[0_0_12px_rgba(6,182,212,0.4)]', bg: 'bg-cyan-500/10' },
    { icon: Dumbbell, color: 'text-emerald-400', border: 'border-emerald-500/60', glow: 'shadow-[0_0_12px_rgba(16,185,129,0.4)]', bg: 'bg-emerald-500/10' },
    { icon: Heart, color: 'text-amber-400', border: 'border-amber-500/60', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]', bg: 'bg-amber-500/10' },
    { icon: Coffee, color: 'text-teal-400', border: 'border-teal-500/60', glow: 'shadow-[0_0_12px_rgba(20,184,166,0.4)]', bg: 'bg-teal-500/10' },
    { icon: Clock, color: 'text-fuchsia-400', border: 'border-fuchsia-500/60', glow: 'shadow-[0_0_12px_rgba(217,70,239,0.4)]', bg: 'bg-fuchsia-500/10' },
  ];

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[380px] mx-auto select-none">
      {/* Background radial aura for the phone */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 via-purple-600/20 to-indigo-500/20 rounded-[50px] blur-2xl -z-10 animate-pulse-glow" />

      {/* Floating 3D Badge: Top Right Lightning */}
      <div className="absolute -top-6 -right-6 sm:-right-8 z-30 animate-float-slow hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#111827]/90 border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.4)] backdrop-blur-md text-xs font-bold text-purple-300">
        <Zap className="w-4 h-4 text-purple-400 fill-purple-400 animate-bounce" />
        <span>2x Streak XP</span>
      </div>

      {/* Floating 3D Badge: Left Checkmark */}
      <div className="absolute top-1/3 -left-8 sm:-left-12 z-30 animate-float-reverse hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#0b1329]/90 border border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.45)] backdrop-blur-md text-xs font-bold text-cyan-300">
        <div className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
          <Check className="w-3 h-3 text-cyan-400 stroke-[3]" />
        </div>
        <span>45-Day Goal Met</span>
      </div>

      {/* Floating 3D Badge: Bottom Right Star */}
      <div className="absolute -bottom-4 -right-4 sm:-right-6 z-30 animate-float-slow hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#0e1628]/90 border border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.4)] backdrop-blur-md text-xs font-bold text-amber-300">
        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        <span>Mastery Tier 3</span>
      </div>

      {/* Phone Outer Chassis */}
      <div className="relative rounded-[46px] p-3 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-[3px] border-slate-600/80 phone-shadow">
        {/* Dynamic Island / Speaker Pill */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-40 flex items-center justify-end px-2">
          <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700" />
        </div>

        {/* Screen Bezel */}
        <div className="relative rounded-[36px] bg-[#0c1220] overflow-hidden border border-slate-800/80 text-white flex flex-col min-h-[580px] sm:min-h-[610px]">
          {/* Top Status Bar Padding */}
          <div className="pt-7 px-5 pb-2 flex items-center justify-between">
            <button className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition-colors">
              <Menu className="w-4 h-4" />
            </button>
            <h2 className="text-sm font-bold tracking-wide text-slate-100">Dashboard</h2>
            <button className="p-1 relative text-slate-400 hover:text-slate-200 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
          </div>

          {/* Phone Screen Body */}
          <div className="p-4 space-y-3.5 flex-1">
            {/* Weekdays Row */}
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {weekDays.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-semibold text-slate-400">{day.label}</span>
                  <button
                    onClick={() => toggleDay(idx)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all ${
                      day.checked
                        ? 'bg-cyan-500/20 border border-cyan-400/80 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-900/60 border border-slate-800 text-slate-600'
                    }`}
                  >
                    {day.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                </div>
              ))}
            </div>

            {/* Active Card: Meditate Daily (Day 45) */}
            <div
              onClick={() => toggleHabit('meditate')}
              className="cursor-pointer group relative rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-950/90 p-3.5 neon-border-cyan transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-white tracking-wide">
                      Meditate Daily
                    </span>
                    <span className="text-xs text-cyan-400 font-semibold ml-1.5">
                      (Day 45)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-cyan-400">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* Habit Card 2: Read 30 mins (Day 28) */}
            <div
              onClick={() => toggleHabit('read')}
              className="cursor-pointer rounded-2xl bg-slate-900/70 border border-slate-800/90 p-3 hover:border-slate-700 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">📖</span>
                  <span className="text-xs font-bold text-slate-200">Read 30 mins</span>
                  <span className="text-[11px] text-slate-400">(Day 28)</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                    habits[1].completed ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: habits[1].completed ? '82%' : '0%' }}
                />
              </div>
            </div>

            {/* Habit Card 3: Exercise (Day 19) */}
            <div
              onClick={() => toggleHabit('exercise')}
              className="cursor-pointer rounded-2xl bg-slate-900/70 border border-slate-800/90 p-3 hover:border-slate-700 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">Exercise</span>
                  <span className="text-[11px] text-slate-400">(Day 19)</span>
                </div>
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                    habits[2].completed ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: habits[2].completed ? '65%' : '0%' }}
                />
              </div>
            </div>

            {/* Streak Counter Bar */}
            <button
              onClick={handleStreakClick}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)] group hover:border-orange-500/60 transition-all text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">Streak:</span>
                <span className="text-sm font-extrabold text-white group-hover:text-orange-300 transition-colors">
                  {streakCount} Days
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-orange-500/20 px-2 py-0.5 rounded-full border border-orange-500/40">
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-flame" />
                <span className="text-[11px] font-bold text-orange-300">1</span>
              </div>
            </button>

            {/* Neon Category Quick Bar */}
            <div className="pt-1 flex items-center justify-between gap-1.5">
              {categories.map((cat, idx) => {
                const Icon = cat.icon;
                const isSelected = activeCategory === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveCategory(idx)}
                    className={`flex-1 aspect-square rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? `${cat.border} ${cat.glow} ${cat.bg} scale-105`
                        : 'border border-slate-800/80 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? cat.color : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom App Navigation Bar */}
          <div className="border-t border-slate-800/90 bg-[#080d18] px-4 py-2 flex items-center justify-between">
            <button
              onClick={() => setActiveNav('home')}
              className={`p-1.5 rounded-lg flex flex-col items-center gap-0.5 ${
                activeNav === 'home' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Home className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveNav('calendar')}
              className={`p-1.5 rounded-lg flex flex-col items-center gap-0.5 ${
                activeNav === 'calendar' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveNav('fav')}
              className={`p-1.5 rounded-lg flex flex-col items-center gap-0.5 ${
                activeNav === 'fav' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveNav('alerts')}
              className={`p-1.5 rounded-lg flex flex-col items-center gap-0.5 ${
                activeNav === 'alerts' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveNav('star')}
              className={`p-1.5 rounded-lg flex flex-col items-center gap-0.5 ${
                activeNav === 'star' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
