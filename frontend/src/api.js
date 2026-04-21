import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5246';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Don't redirect on auth endpoints (login/register return 401 for bad creds)
      const url = err.config?.url || '';
      if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  profile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Products
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
};

// Categories
export const categoryAPI = {
  getAll: () => api.get('/categories'),
};

// Cart
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart', data),
  update: (id, data) => api.put(`/cart/${id}`, data),
  remove: (id) => api.delete(`/cart/${id}`),
  clear: () => api.delete('/cart/clear'),
};

// Orders
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

// Vouchers
export const voucherAPI = {
  getAvailable: () => api.get('/vouchers/available'),
  validate: (data) => api.post('/vouchers/validate', data),
};

// Loyalty
export const loyaltyAPI = {
  getPoints: () => api.get('/loyalty/my-points'),
  getHistory: () => api.get('/loyalty/history'),
};

// Reviews
export const reviewAPI = {
  getList: (productId) => api.get(`/products/${productId}/reviews`),
  getSummary: (productId) => api.get(`/products/${productId}/reviews/summary`),
  create: (productId, data) => api.post(`/products/${productId}/reviews`, data),
};

// Payment
export const paymentAPI = {
  getInfo: (orderId) => api.get(`/payment/${orderId}/pay`),
  confirm: (orderId) => api.post(`/payment/${orderId}/confirm`),
};

// Admin
export const adminAPI = {
  dashboard: () => api.get('/admin/dashboard/overview'),
  revenueReport: (params) => api.get('/admin/dashboard/revenue', { params }),
  topProducts: (count) => api.get('/admin/dashboard/top-products', { params: { count } }),
  topCustomers: (count) => api.get('/admin/dashboard/top-customers', { params: { count } }),
  orderStats: () => api.get('/admin/dashboard/order-stats'),
  getOrders: () => api.get('/orders/admin'),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  loyaltyStats: () => api.get('/admin/loyalty/stats'),
  loyaltyMembers: (tier) => api.get('/admin/loyalty/members', { params: { tier } }),
  // Product CRUD
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  // Voucher CRUD
  getVouchers: () => api.get('/vouchers/available'),
  createVoucher: (data) => api.post('/admin/vouchers', data),
  updateVoucher: (id, data) => api.put(`/admin/vouchers/${id}`, data),
  deleteVoucher: (id) => api.delete(`/admin/vouchers/${id}`),
};

export default api;
