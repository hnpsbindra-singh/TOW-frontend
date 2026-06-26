import axios from 'axios';

const api = axios.create({
  baseURL: 'https://thaparonwheels.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

// Inject JWT token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  resetRequest: (data) => api.post('/auth/resetRequest', data),
};

// ─── Profile ─────────────────────────────────────────────
export const profileApi = {
  getMe: () => api.get('/profile/me'),
  update: (data) => api.put('/profile/me/update', data),
  uploadProof: (file) => {
    const fd = new FormData();
    fd.append('document', file);
    return api.put('/profile/me/update/upload-proof', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ─── Student ─────────────────────────────────────────────
export const studentApi = {
  createRide: (data) => api.post('/student/rides', data),
  getAllRides: () => api.get('/student/rides'),
  getRide: (rideId) => api.get(`/student/ride/${rideId}`),
  cancelRide: (rideId) => api.delete(`/student/ride/${rideId}`),
  getDriver: (rideId) => api.get(`/student/rides/${rideId}/driver`),
  markComplete: (rideId) => api.patch(`/student/rides/${rideId}/complete`),
  completedHistory: () => api.get('/student/history/completed'),
  activeHistory: () => api.get('/student/history/accepted'),
};

// ─── Driver ──────────────────────────────────────────────
export const driverApi = {
  pendingRides: () => api.get('/driver/rides/pending'),
  getRide: (rideId) => api.get(`/driver/rides/details/${rideId}`),
  acceptRide: (rideId) => api.patch(`/driver/rides/details/${rideId}`),
  activeRides: () => api.get('/driver/rides/active'),
  completedRides: () => api.get('/driver/rides/completed'),
};

// ─── Admin ───────────────────────────────────────────────
export const adminApi = {
  getStudents: () => api.get('/admin/students'),
  getDrivers: () => api.get('/admin/drivers'),
  getUser: (userId) => api.get(`/admin/user/${userId}`),
  getPendingVerifications: () => api.get('/admin/pending-Verifications'),
  getProof: (userId) => `${api.defaults.baseURL}/admin/users/${userId}/proof`,
  getProofBlob: (userId) => api.get(`/admin/users/${userId}/proof`, { responseType: 'blob' }),
  verifyUser: (userId) => api.patch(`/admin/verify/${userId}`),
  rejectUser: (userId) => api.patch(`/admin/reject/${userId}`),
  makeDriver: (userId) => api.patch(`/admin/make-driver/${userId}`),
  makeAdmin: (userId) => api.patch(`/admin/make-admin/${userId}`),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getAllRides: () => api.get('/admin/rides'),
};

export default api;
