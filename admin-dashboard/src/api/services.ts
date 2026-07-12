import { apiClient } from './axiosClient';

const data = <T>(res: { data: { data: T } }) => res.data.data;

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login/admin', { email, password }).then((r) => r.data),
  logout: () => apiClient.post('/auth/logout').then(data),
};

// Analytics
export const analyticsApi = {
  dashboard: (storeId?: string) =>
    apiClient.get('/analytics/dashboard', { params: { storeId } }).then(data),
  revenue: (days = 30, storeId?: string) =>
    apiClient.get('/analytics/revenue', { params: { days, storeId } }).then(data),
  topProducts: (limit = 10, storeId?: string) =>
    apiClient.get('/analytics/top-products', { params: { limit, storeId } }).then(data),
  orderStatus: (storeId?: string) =>
    apiClient.get('/analytics/order-status', { params: { storeId } }).then(data),
};

// Stores
export const storeApi = {
  getAll: () => apiClient.get('/stores').then(data),
  getById: (id: string) => apiClient.get(`/stores/${id}`).then(data),
  create: (body: any) => apiClient.post('/stores', body).then(data),
  update: (id: string, body: any) => apiClient.put(`/stores/${id}`, body).then(data),
};

// Products
export const productApi = {
  getAll: (params?: any) => apiClient.get('/products', { params }).then(data),
  getById: (id: string) => apiClient.get(`/products/${id}`).then(data),
  create: (body: any) => apiClient.post('/products', body).then(data),
  update: (id: string, body: any) => apiClient.put(`/products/${id}`, body).then(data),
  delete: (id: string) => apiClient.delete(`/products/${id}`).then(data),
};

// Categories
export const categoryApi = {
  getAll: () => apiClient.get('/categories').then(data),
  create: (body: any) => apiClient.post('/categories', body).then(data),
  update: (id: string, body: any) => apiClient.put(`/categories/${id}`, body).then(data),
  delete: (id: string) => apiClient.delete(`/categories/${id}`).then(data),
};

// Orders
export const orderApi = {
  getAdmin: (params?: any) => apiClient.get('/orders/admin', { params }).then(data),
  getById: (id: string) => apiClient.get(`/orders/${id}`).then(data),
  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/orders/${id}/status`, { status }).then(data),
};

// Inventory
export const inventoryApi = {
  getByStore: (storeId: string, params?: any) =>
    apiClient.get('/inventory', { params: { storeId, ...params } }).then(data),
  getLowStock: (storeId?: string) =>
    apiClient.get('/inventory/low-stock', { params: { storeId } }).then(data),
  update: (body: any) => apiClient.patch('/inventory/update', body).then(data),
};

// Workers
export const workerApi = {
  getAll: (params?: any) => apiClient.get('/workers', { params }).then(data),
  create: (body: any) => apiClient.post('/workers', body).then(data),
  toggle: (id: string) => apiClient.patch(`/workers/${id}/toggle`).then(data),
};

// Customers (admin)
export const customerApi = {
  getAll: (params?: any) => apiClient.get('/admin/customers', { params }).then(data),
  getById: (id: string) => apiClient.get(`/admin/customers/${id}`).then(data),
  toggle: (id: string) => apiClient.patch(`/admin/customers/${id}/toggle`).then(data),
};

// Coupons
export const couponApi = {
  getAll: (params?: any) => apiClient.get('/coupons', { params }).then(data),
  create: (body: any) => apiClient.post('/coupons', body).then(data),
  toggle: (id: string) => apiClient.patch(`/coupons/${id}/toggle`).then(data),
  delete: (id: string) => apiClient.delete(`/coupons/${id}`).then(data),
};

// Notifications
export const notificationApi = {
  getAll: (params?: any) => apiClient.get('/notifications', { params }).then(data),
};
