import api from './axiosInstance';

const configForPayload = (payload) => (payload instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);

export const tripsApi = {
  list: (params) => api.get('/trips', { params }),
  create: (payload) => api.post('/trips', payload, configForPayload(payload)),
  get: (id) => api.get(`/trips/${id}`),
  update: (id, payload) => api.put(`/trips/${id}`, payload, configForPayload(payload)),
  remove: (id) => api.delete(`/trips/${id}`),
  uploadCover: (id, payload) => api.put(`/trips/${id}/cover`, payload, configForPayload(payload)),
  share: (id) => api.post(`/trips/${id}/share`),
  export: (id) => api.get(`/trips/${id}/export`)
};
