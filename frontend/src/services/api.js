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

  // Downloads the SVG certificate with auth token attached, then saves it locally.
  downloadCertificate: async () => {
    const response = await api.get('/census/certificate', {
      responseType: 'blob',          // receive raw binary/svg
    });

    // Determine filename from Content-Disposition header if present
    const disposition = response.headers['content-disposition'];
    let filename = 'census-certificate.svg';
    if (disposition) {
      const match = disposition.match(/filename="?([^";\n]+)"?/);
      if (match?.[1]) filename = match[1];
    }

    // Create a temporary object URL and trigger browser download
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'image/svg+xml' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
  addFamilyMember: (formData) => api.post('/census/family-member', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deleteFamilyMember: (id) => api.delete(`/census/family-member/${id}`),
  downloadFamilyDocument: async (memberId, docType, memberName = 'family-document') => {
    const response = await api.get(`/census/family-document/${memberId}/${docType}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${memberName.replace(/\s+/g, '_')}-${docType}-proof.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};


export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  listCitizens: (search = '', status = '') => api.get(`/admin/citizens?search=${search}&status=${status}`),
  getCitizenDetails: (id) => api.get(`/admin/citizen/${id}`),
  reviewCensus: (id, action, comments) => api.post(`/admin/review/${id}`, { action, comments }),
};

export default api;
