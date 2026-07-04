import axios from 'axios';
import { getFriendlyErrorMessage } from '../utils/errorMessages';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('seatflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const rawMessage = error.response?.data?.message || error.message || 'Something went wrong';
    const status = error.response?.status;
    const details = error.response?.data?.details;

    return Promise.reject({
      message: getFriendlyErrorMessage({ message: rawMessage, status }),
      status,
      details,
      rawMessage,
    });
  }
);

export default api;
