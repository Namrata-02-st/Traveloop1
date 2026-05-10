import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && useAuthStore.getState().isAuthenticated) {
      useAuthStore.getState().logout();
      toast.error('Session expired. Please log in again.');
      window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

export default api;
