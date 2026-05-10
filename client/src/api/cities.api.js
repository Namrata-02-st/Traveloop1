import api from './axiosInstance';

export const citiesApi = {
  list: (params) => api.get('/cities', { params }),
  get: (id) => api.get(`/cities/${id}`),
  activities: (id, params) => api.get(`/cities/${id}/activities`, { params })
};
