import axiosClient from './axiosClient';

export const userApi = {
  updateProfile: async (data) => {
    const res = await axiosClient.put('/users/profile', data);
    return res.data;
  },

  updatePassword: async (data) => {
    const res = await axiosClient.put('/users/password', data);
    return res.data;
  },

  exportData: async (format = 'json') => {
    const res = await axiosClient.get('/users/export', {
      params: { format },
      responseType: 'blob', // Important for file downloads
    });

    const blob = new Blob([res.data], {
      type: format === 'csv' ? 'text/csv' : 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `streakforge-export-${dateStr}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
