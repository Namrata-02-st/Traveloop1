import api from './axiosInstance';

export const activitiesApi = {
  search: (params) => api.get('/activities', { params }),
  get: (id) => api.get(`/activities/${id}`),
  listForStop: (stopId) => api.get(`/stops/${stopId}/activities`),
  addToStop: (stopId, payload) => api.post(`/stops/${stopId}/activities`, payload),
  updateForStop: (stopId, actId, payload) => api.put(`/stops/${stopId}/activities/${actId}`, payload),
  removeFromStop: (stopId, actId) => api.delete(`/stops/${stopId}/activities/${actId}`)
};
