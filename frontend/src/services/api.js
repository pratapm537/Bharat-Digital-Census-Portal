import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-inject JWT token into requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Endpoints definitions
export const authAPI = {
  checkAadhaar: (aadhaar) => api.post('/auth/check-aadhaar', { aadhaar }),
  sendOtp: (phone, aadhaar) => api.post('/auth/send-otp', { phone, aadhaar }),
  verifyOtp: (phone, otp) => api.post('/auth/verify-otp', { phone, otp }),
  register: (data) => api.post('/auth/register', data),
  loginOfficer: (username, password) => api.post('/auth/officer-login', { username, password }),
  getMe: () => api.get('/auth/me'),
};

export const censusAPI = {
  getDraft: () => api.get('/census/draft'),
  saveStep: (step, data) => api.post('/census/save-step', { step, data }),
  uploadDocument: (formData) => api.post('/census/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getCertificateDownloadUrl: () => `${API_BASE_URL}/census/certificate`,
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  listCitizens: (search = '', status = '') => api.get(`/admin/citizens?search=${search}&status=${status}`),
  getCitizenDetails: (id) => api.get(`/admin/citizen/${id}`),
  reviewCensus: (id, action, comments) => api.post(`/admin/review/${id}`, { action, comments }),
};

export default api;
