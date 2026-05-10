import api from './axiosInstance';

export const adminApi = {
  stats: () => api.get('/admin/stats'),
  users: (params) => api.get('/admin/users', { params }),
  setUserStatus: (id, is_active) => api.put(`/admin/users/${id}/status`, { is_active }),
  removeUser: (id) => api.delete(`/admin/users/${id}`),
  trips: () => api.get('/admin/trips'),
  popularCities: () => api.get('/admin/cities/popular'),
  popularActivities: () => api.get('/admin/activities/popular')
};
