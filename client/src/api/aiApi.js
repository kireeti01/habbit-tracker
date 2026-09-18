import axiosClient from './axiosClient';

export const aiApi = {
  suggestHabits: async (goal) => {
    const res = await axiosClient.post('/ai/suggest-habits', { goal });
    return res.data;
  },

  getWeeklyInsight: async (force = false) => {
    const res = await axiosClient.get('/ai/weekly-insight', {
      params: { force: force ? 'true' : undefined },
    });
    return res.data;
  },

  getMotivation: async (habitId) => {
    const res = await axiosClient.post('/ai/motivation', { habitId });
    return res.data;
  },

  chat: async (message, conversationHistory = []) => {
    const res = await axiosClient.post('/ai/chat', { message, conversationHistory });
    return res.data;
  },
};
