import api from './axiosInstance';

export const shareApi = {
  get: (token) => api.get(`/share/${token}`),
  copy: (token) => api.post(`/share/${token}/copy`)
};
