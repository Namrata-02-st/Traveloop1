import api from './axiosInstance';

export const stopsApi = {
  list: (tripId) => api.get(`/trips/${tripId}/stops`),
  create: (tripId, payload) => api.post(`/trips/${tripId}/stops`, payload),
  update: (tripId, stopId, payload) => api.put(`/trips/${tripId}/stops/${stopId}`, payload),
  remove: (tripId, stopId) => api.delete(`/trips/${tripId}/stops/${stopId}`),
  reorder: (tripId, orderedIds) => api.put(`/trips/${tripId}/stops/reorder`, { orderedIds })
};
