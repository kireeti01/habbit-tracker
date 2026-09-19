import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Search, Filter, Archive, Flame, Sparkles, CheckCircle2 } from 'lucide-react';
import { useHabitStore } from '../store/habitStore';
import HabitCard from '../components/habits/HabitCard';
import HabitFormModal from '../components/habits/HabitFormModal';
import BackfillModal from '../components/habits/BackfillModal';
import { CATEGORIES } from '../utils/categoryColors';

export default function HabitsPage() {
  const {
    habits,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    showArchived,
    setShowArchived,
    fetchHabits,
    createHabit,
    updateHabit,
    archiveHabit,
    deleteHabit,
    toggleCheckIn,
  } = useHabitStore();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [backfillModalOpen, setBackfillModalOpen] = useState(false);
  const [backfillHabit, setBackfillHabit] = useState(null);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // Client search filter
  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      const matchesSearch =
        !searchQuery ||
        habit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        habit.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [habits, searchQuery]);

  const handleOpenCreate = () => {
    setEditingHabit(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (habit) => {
    setEditingHabit(habit);
    setFormModalOpen(true);
  };

  const handleOpenBackfill = (habit) => {
    setBackfillHabit(habit);
    setBackfillModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingHabit) {
      return await updateHabit(editingHabit._id, data);
    } else {
      return await createHabit(data);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
            <span>Habit Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Habit Forge</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Build consistency, customize flexible schedules, and manage daily check-ins.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="self-start sm:self-auto px-6 py-3 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-cyan-400/60 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-cyan-200" />
          <span>Forge Habit</span>
        </button>
      </div>

      {/* Filters & Search Card */}
      <div className="rounded-3xl bg-[#0c1322]/85 border border-slate-800/80 p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl backdrop-blur-xl">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search active habits by name or keyword..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#080d1a] border border-slate-700/80 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
          />
        </div>

        {/* Archived toggle */}
        <div className="flex items-center gap-2 self-end md:self-auto px-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-400 hover:text-slate-200 select-none">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span>Show Archived</span>
          </label>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                fetchHabits();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shadow-sm ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.25)] scale-105'
                  : 'bg-[#0c1322]/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Habits Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-56 rounded-3xl bg-slate-900/60 border border-slate-800/80 animate-pulse" />
          ))}
        </div>
      ) : filteredHabits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit._id}
              habit={habit}
              onCheckIn={toggleCheckIn}
              onEdit={handleOpenEdit}
              onArchive={archiveHabit}
              onDelete={deleteHabit}
              onOpenBackfill={handleOpenBackfill}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-[#0c1322]/85 border border-slate-800 p-12 text-center max-w-md mx-auto shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-4 border border-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No habits found</h3>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            {searchQuery
              ? 'No habits match your search criteria. Try a different query or reset filters.'
              : 'You haven’t forged any habits yet. Forge your first habit to begin building momentum!'}
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-6 py-3 rounded-2xl font-extrabold text-xs text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-cyan-400/60 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Forge First Habit
          </button>
        </div>
      )}

      {/* Modals */}
      <HabitFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingHabit}
      />

      <BackfillModal
        isOpen={backfillModalOpen}
        onClose={() => setBackfillModalOpen(false)}
        habit={backfillHabit}
        onCheckInSuccess={toggleCheckIn}
      />
    </div>
  );
}

