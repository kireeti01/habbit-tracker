import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Search, Filter, Archive, Flame, Sparkles } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Habit Management</h1>
          <p className="text-slate-400 text-sm mt-1">
            Build consistency, customize frequencies, and track daily check-ins.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-brand-600 to-indigo-500 hover:from-brand-500 hover:to-indigo-400 shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Forge Habit</span>
        </button>
      </div>

      {/* Filters & Search Row */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your habits..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Archived switch */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-400 hover:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-brand-600 focus:ring-brand-500"
            />
            <span>Show Archived</span>
          </label>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                fetchHabits();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-brand-500/20 text-brand-300 border-brand-500/50 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-card h-52 rounded-2xl border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filteredHabits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
        <div className="glass-card rounded-2xl border border-slate-800 p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto mb-4 border border-brand-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No habits found</h3>
          <p className="text-xs text-slate-400 mb-6">
            {searchQuery
              ? 'No habits match your search criteria. Try a different query.'
              : 'You haven’t forged any habits yet. Start with your first habit!'}
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-brand-600 hover:bg-brand-500 transition-colors inline-flex items-center gap-2"
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
