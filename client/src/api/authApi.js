import axiosClient from './axiosClient';

export const authApi = {
  register: async (data) => {
    const res = await axiosClient.post('/auth/register', data);
    return res.data;
  },

  login: async (credentials) => {
    const res = await axiosClient.post('/auth/login', credentials);
    return res.data;
  },

  logout: async () => {
    const res = await axiosClient.post('/auth/logout');
    return res.data;
  },

  refresh: async () => {
    const res = await axiosClient.post('/auth/refresh');
    return res.data;
  },

  getMe: async () => {
    const res = await axiosClient.get('/auth/me');
    return res.data;
  },
};
