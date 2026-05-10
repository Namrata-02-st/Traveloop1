import api from './axiosInstance';

export const notesApi = {
  list: (tripId, params) => api.get(`/trips/${tripId}/notes`, { params }),
  create: (tripId, payload) => api.post(`/trips/${tripId}/notes`, payload),
  update: (tripId, noteId, payload) => api.put(`/trips/${tripId}/notes/${noteId}`, payload),
  remove: (tripId, noteId) => api.delete(`/trips/${tripId}/notes/${noteId}`)
};
