import React, { useState, useEffect } from 'react';
import { X, Sparkles, Clock, Calendar, Check } from 'lucide-react';
import { CATEGORIES, PRESET_COLORS, PRESET_ICONS, DAYS_OF_WEEK } from '../../utils/categoryColors';

export default function HabitFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('health');
  const [color, setColor] = useState('#6366F1');
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
      setColor(initialData.color || '#6366F1');
      setIcon(initialData.icon || '⚡');
      setFrequencyType(initialData.frequency?.type || 'daily');
      setSelectedDays(initialData.frequency?.days || [0, 1, 2, 3, 4, 5, 6]);
      setTargetTime(initialData.targetTime || '');
    } else {
      setTitle('');
      setDescription('');
      setCategory('health');
      setColor('#6366F1');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-lg rounded-2xl border border-slate-800 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-1">
          {initialData ? 'Edit Habit' : 'Forge New Habit'}
        </h2>
        <p className="text-xs text-slate-400 mb-5">
          {initialData ? 'Fine-tune your habit schedule and parameters' : 'Define your daily ritual and start your streak'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Habit Title *
            </label>
            <input
              type="text"
              required
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning Meditation, 5km Run, LeetCode"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why this habit matters to you..."
              className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-medium border transition-all ${
                    category === cat.id
                      ? 'bg-brand-500/15 border-brand-500/50 text-brand-300 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Icon & Color Pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Emoji Icon
              </label>
              <div className="flex flex-wrap gap-1.5 bg-slate-900 p-2 rounded-xl border border-slate-800">
                {PRESET_ICONS.map((emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => setIcon(emoji)}
                    className={`w-7 h-7 text-sm rounded-lg flex items-center justify-center transition-transform ${
                      icon === emoji ? 'bg-brand-500/20 scale-110 border border-brand-500/40' : 'hover:bg-slate-800'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Color Accent
              </label>
              <div className="flex flex-wrap gap-1.5 bg-slate-900 p-2 rounded-xl border border-slate-800">
                {PRESET_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-lg transition-transform flex items-center justify-center ${
                      color === c ? 'ring-2 ring-white scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {color === c && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Frequency Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Frequency Schedule
            </label>
            <div className="flex gap-3 mb-2">
              <button
                type="button"
                onClick={() => setFrequencyType('daily')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  frequencyType === 'daily'
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Daily (All 7 Days)
              </button>
              <button
                type="button"
                onClick={() => setFrequencyType('weekly')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  frequencyType === 'weekly'
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Specific Weekdays
              </button>
            </div>

            {frequencyType === 'weekly' && (
              <div className="flex justify-between gap-1 mt-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                {DAYS_OF_WEEK.map((d) => {
                  const isSelected = selectedDays.includes(d.id);
                  return (
                    <button
                      type="button"
                      key={d.id}
                      onClick={() => toggleDay(d.id)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-brand-600 text-white shadow-md'
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
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Time (Optional)
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="time"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/20 transition-all disabled:opacity-50"
            >
              {submitting ? 'Saving...' : initialData ? 'Update Habit' : 'Forge Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
