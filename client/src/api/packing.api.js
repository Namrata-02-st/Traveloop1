import api from './axiosInstance';

export const packingApi = {
  list: (tripId) => api.get(`/trips/${tripId}/packing`),
  create: (tripId, payload) => api.post(`/trips/${tripId}/packing`, payload),
  update: (tripId, itemId, payload) => api.put(`/trips/${tripId}/packing/${itemId}`, payload),
  remove: (tripId, itemId) => api.delete(`/trips/${tripId}/packing/${itemId}`),
  reset: (tripId) => api.delete(`/trips/${tripId}/packing`)
};
