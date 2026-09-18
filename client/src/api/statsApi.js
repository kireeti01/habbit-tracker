import axiosClient from './axiosClient';

export const statsApi = {
  getOverview: async () => {
    const res = await axiosClient.get('/stats/overview');
    return res.data;
  },

  getHeatmap: async (habitId) => {
    const res = await axiosClient.get(`/stats/heatmap/${habitId}`);
    return res.data;
  },

  getWeekly: async () => {
    const res = await axiosClient.get('/stats/weekly');
    return res.data;
  },
};
