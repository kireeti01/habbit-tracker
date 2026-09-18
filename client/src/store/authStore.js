import { create } from 'zustand';
import { authApi } from '../api/authApi';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  error: null,

  setSession: (user, accessToken) => {
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isCheckingAuth: false,
      error: null,
    });
  },

  clearSession: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isCheckingAuth: false,
      error: null,
    });
  },

  setUser: (user) => {
    set({ user });
  },

  register: async (userData) => {
    try {
      const res = await authApi.register(userData);
      const { user, accessToken } = res.data;
      set({
        user,
        accessToken,
        isAuthenticated: true,
        error: null,
      });
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please check your details.';
      set({ error: message });
      return { success: false, message };
    }
  },

  login: async (credentials) => {
    try {
      const res = await authApi.login(credentials);
      const { user, accessToken } = res.data;
      set({
        user,
        accessToken,
        isAuthenticated: true,
        error: null,
      });
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password.';
      set({ error: message });
      return { success: false, message };
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      get().clearSession();
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      // Attempt silent refresh via httpOnly cookie
      const res = await authApi.refresh();
      const { user, accessToken } = res.data;
      set({
        user,
        accessToken,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (err) {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },
}));
