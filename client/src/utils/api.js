import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const path = window.location.pathname;
      if (path.startsWith('/admin') && path !== '/admin/login') {
        window.location.href = '/admin/login';
      } else if (['/dashboard', '/profile', '/saved'].includes(path)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const propertiesApi = {
  getAll:          (params) => api.get('/properties', { params }),
  getFeatured:     ()       => api.get('/properties/featured'),
  getNeighborhoods:()       => api.get('/properties/neighborhoods'),
  getById:         (id)     => api.get(`/properties/${id}`),
  create:          (data)   => api.post('/properties', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:          (id, data) => api.put(`/properties/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:          (id)     => api.delete(`/properties/${id}`),
};

export const inquiriesApi = {
  create:  (data)     => api.post('/inquiries', data),
  getAll:  (params)   => api.get('/inquiries', { params }),
  getById: (id)       => api.get(`/inquiries/${id}`),
  update:  (id, data) => api.patch(`/inquiries/${id}`, data),
  delete:  (id)       => api.delete(`/inquiries/${id}`),
};

export const applicationsApi = {
  create:  (data)     => api.post('/applications', data),
  getAll:  (params)   => api.get('/applications', { params }),
  getById: (id)       => api.get(`/applications/${id}`),
  update:  (id, data) => api.patch(`/applications/${id}`, data),
  delete:  (id)       => api.delete(`/applications/${id}`),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
};

export const settingsApi = {
  get:       () => api.get('/admin/settings'),
  update:    (data) => api.put('/admin/settings', data),
  getPublic: () => api.get('/admin/public-settings'),
};

export const authApi = {
  register:       (data) => api.post('/auth/register', data),
  login:          (data) => api.post('/auth/login', data),
  logout:         ()     => api.post('/auth/logout'),
  me:             ()     => api.get('/auth/me'),
  changePassword: (data) => api.patch('/auth/change-password', data),
};

export const usersApi = {
  getProfile:    ()               => api.get('/users/profile'),
  updateProfile: (data)           => api.patch('/users/profile', data),
  getSaved:      ()               => api.get('/users/saved'),
  saveProperty:  (propertyId)     => api.post(`/users/saved/${propertyId}`),
  unsaveProperty:(propertyId)     => api.delete(`/users/saved/${propertyId}`),
};

export default api;
