import React, { useState, useEffect } from 'react';
import { X, Sparkles, Clock, Calendar, Check, Zap } from 'lucide-react';
import { CATEGORIES, PRESET_COLORS, PRESET_ICONS, DAYS_OF_WEEK } from '../../utils/categoryColors';

export default function HabitFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('health');
  const [color, setColor] = useState('#06b6d4');
  const [icon, setIcon] = useState('⚡');
  const [frequencyType, setFrequencyType] = useState('daily');
  const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [targetTime, setTargetTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setCategory(initialData.category || 'health');
      setColor(initialData.color || '#06b6d4');
      setIcon(initialData.icon || '⚡');
      setFrequencyType(initialData.frequency?.type || 'daily');
      setSelectedDays(initialData.frequency?.days || [0, 1, 2, 3, 4, 5, 6]);
      setTargetTime(initialData.targetTime || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('health');
      setColor('#06b6d4');
      setIcon('⚡');
      setFrequencyType('daily');
      setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
      setTargetTime('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const toggleDay = (dayId) => {
    if (selectedDays.includes(dayId)) {
      if (selectedDays.length === 1) return; // Must have at least 1 day
      setSelectedDays(selectedDays.filter((d) => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId].sort());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title,
      description,
      category,
      color,
      icon,
      frequency: {
        type: frequencyType,
        days: frequencyType === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : selectedDays,
      },
      targetTime,
    };

    const res = await onSubmit(payload);
    setSubmitting(false);
    if (res?.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="glass-card w-full max-w-lg rounded-3xl border border-slate-700/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto backdrop-blur-2xl">
        {/* Glowing Top Line */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5 shadow-lg"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 15px ${color}80`,
          }}
        />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md border border-white/10"
            style={{ backgroundColor: `${color}25` }}
          >
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-black text-white">
              {initialData ? 'Edit Habit Ritual' : 'Forge New Habit'}
            </h2>
            <p className="text-xs text-slate-400">
              {initialData
                ? 'Fine-tune your habit schedule and target triggers'
                : 'Define your daily ritual and kickstart an unbreakable streak'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Habit Title *
            </label>
            <input
              type="text"
              required
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Deep Focus Session, 5km Morning Run, LeetCode 2 Problems"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Description & Motivation (Optional)
            </label>
            <textarea
              rows={2}
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why this daily discipline matters to your long-term vision..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold border transition-all ${
                    category === cat.id
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)] scale-[1.02]'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Icon & Color Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Emoji Icon
              </label>
              <div className="flex flex-wrap gap-1.5 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                {PRESET_ICONS.map((emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => setIcon(emoji)}
                    className={`w-8 h-8 text-base rounded-lg flex items-center justify-center transition-all ${
                      icon === emoji
                        ? 'bg-cyan-500/20 scale-110 border border-cyan-400 shadow-sm'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Glow Color Accent
              </label>
              <div className="flex flex-wrap gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                {PRESET_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-lg transition-transform flex items-center justify-center ${
                      color === c
                        ? 'ring-2 ring-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    {color === c && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Frequency Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Cadence Schedule
            </label>
            <div className="flex gap-3 mb-2">
              <button
                type="button"
                onClick={() => setFrequencyType('daily')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  frequencyType === 'daily'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Daily (All 7 Days)
              </button>
              <button
                type="button"
                onClick={() => setFrequencyType('weekly')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  frequencyType === 'weekly'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Selected Weekdays
              </button>
            </div>

            {frequencyType === 'weekly' && (
              <div className="flex justify-between gap-1 mt-2 bg-slate-950/70 p-2 rounded-xl border border-slate-800 animate-fade-in">
                {DAYS_OF_WEEK.map((d) => {
                  const isSelected = selectedDays.includes(d.id);
                  return (
                    <button
                      type="button"
                      key={d.id}
                      onClick={() => toggleDay(d.id)}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md scale-105'
                          : 'bg-slate-800/80 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {d.short}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Target Time */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Daily Target Time (Optional)
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="time"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 border border-cyan-400/30 shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Calibrating...' : initialData ? 'Save Changes' : 'Forge Habit 🔥'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

