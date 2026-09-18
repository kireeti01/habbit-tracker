import { create } from 'zustand';
import { habitApi } from '../api/habitApi';
import toast from 'react-hot-toast';

export const useHabitStore = create((set, get) => ({
  habits: [],
  loading: false,
  selectedCategory: 'all',
  searchQuery: '',
  showArchived: false,

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setShowArchived: (show) => {
    set({ showArchived: show });
    get().fetchHabits();
  },

  fetchHabits: async () => {
    set({ loading: true });
    try {
      const { showArchived, selectedCategory } = get();
      const res = await habitApi.getHabits({
        includeArchived: showArchived,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
      });
      set({ habits: res.data, loading: false });
    } catch (err) {
      set({ loading: false });
      toast.error('Failed to load habits');
    }
  },

  createHabit: async (habitData) => {
    try {
      const res = await habitApi.createHabit(habitData);
      set((state) => ({ habits: [res.data, ...state.habits] }));
      toast.success('Habit created successfully! 🔥');
      return { success: true, habit: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create habit';
      toast.error(msg);
      return { success: false, message: msg };
    }
  },

  updateHabit: async (id, updateData) => {
    try {
      const res = await habitApi.updateHabit(id, updateData);
      set((state) => ({
        habits: state.habits.map((h) => (h._id === id ? { ...h, ...res.data } : h)),
      }));
      toast.success('Habit updated!');
      return { success: true, habit: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update habit';
      toast.error(msg);
      return { success: false, message: msg };
    }
  },

  archiveHabit: async (id) => {
    try {
      const res = await habitApi.toggleArchive(id);
      const isArchived = res.data.archived;
      set((state) => {
        if (!state.showArchived) {
          return { habits: state.habits.filter((h) => h._id !== id) };
        }
        return {
          habits: state.habits.map((h) => (h._id === id ? { ...h, archived: isArchived } : h)),
        };
      });
      toast.success(isArchived ? 'Habit archived' : 'Habit restored');
    } catch (err) {
      toast.error('Failed to toggle archive state');
    }
  },

  deleteHabit: async (id) => {
    try {
      await habitApi.deleteHabit(id);
      set((state) => ({ habits: state.habits.filter((h) => h._id !== id) }));
      toast.success('Habit permanently deleted');
    } catch (err) {
      toast.error('Failed to delete habit');
    }
  },

  toggleCheckIn: async (habitId, dateStr, note = '') => {
    // Optimistic UI update
    const previousHabits = get().habits;
    set((state) => ({
      habits: state.habits.map((h) => {
        if (h._id === habitId) {
          const wasCompleted = h.todayCompleted;
          const nextCompleted = !wasCompleted;
          const nextStreak = nextCompleted ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1);
          return {
            ...h,
            todayCompleted: nextCompleted,
            currentStreak: nextStreak,
            longestStreak: Math.max(h.longestStreak, nextStreak),
            isAtRisk: false,
          };
        }
        return h;
      }),
    }));

    try {
      const res = await habitApi.checkIn(habitId, { date: dateStr, note });
      // Update with server recalculated values
      set((state) => ({
        habits: state.habits.map((h) => {
          if (h._id === habitId) {
            return {
              ...h,
              ...res.data.habit,
              todayCompleted: res.data.log.completed,
              currentStreak: res.data.streaks.currentStreak,
              longestStreak: res.data.streaks.longestStreak,
              isAtRisk: res.data.streaks.isAtRisk,
            };
          }
          return h;
        }),
      }));
      return res.data;
    } catch (err) {
      // Rollback on failure
      set({ habits: previousHabits });
      const msg = err.response?.data?.message || 'Check-in failed';
      toast.error(msg);
      throw err;
    }
  },
}));
