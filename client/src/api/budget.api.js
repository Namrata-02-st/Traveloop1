import api from './axiosInstance';

export const budgetApi = {
  get: (tripId) => api.get(`/trips/${tripId}/budget`),
  update: (tripId, total_budget) => api.put(`/trips/${tripId}/budget`, { total_budget })
};
