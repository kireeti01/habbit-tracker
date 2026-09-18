import axiosClient from './axiosClient';

export const habitApi = {
  getHabits: async (params = {}) => {
    const res = await axiosClient.get('/habits', { params });
    return res.data;
  },

  getHabitById: async (id) => {
    const res = await axiosClient.get(`/habits/${id}`);
    return res.data;
  },

  createHabit: async (data) => {
    const res = await axiosClient.post('/habits', data);
    return res.data;
  },

  updateHabit: async (id, data) => {
    const res = await axiosClient.put(`/habits/${id}`, data);
    return res.data;
  },

  deleteHabit: async (id) => {
    const res = await axiosClient.delete(`/habits/${id}`);
    return res.data;
  },

  toggleArchive: async (id) => {
    const res = await axiosClient.patch(`/habits/${id}/archive`);
    return res.data;
  },

  checkIn: async (id, { date, completed, note }) => {
    const res = await axiosClient.post(`/habits/${id}/check`, { date, completed, note });
    return res.data;
  },

  getLogs: async (id, params = {}) => {
    const res = await axiosClient.get(`/habits/${id}/logs`, { params });
    return res.data;
  },
};
