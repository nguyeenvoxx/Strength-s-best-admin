import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Auth
export const login = async (data: { email: string; password: string }) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};
export const signup = async (data: any) => {
  const response = await api.post('/auth/signup', data);
  return response.data;
};

// Users
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data.data?.users || [];
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const updateUser = async (id: string, data: any) => {
  const response = await api.patch(`/admin/users/${id}`, data);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/users');
  return response.data;
};
export const updateUserProfile = async (data: any) => {
  const response = await api.patch('/users', data);
  return response.data;
};
export const deleteUserAccount = async () => {
  const response = await api.delete('/users');
  return response.data;
};

// Products
export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data.data?.products || [];
};
export const getProduct = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};
export const createProduct = async (data: any) => {
  const response = await api.post('/products', data);
  return response.data;
};
export const updateProduct = async (id: string, data: any) => {
  const response = await api.patch(`/products/${id}`, data);
  return response.data;
};
export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Orders
export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data.data?.orders || [];
};
export const createOrder = async (data: any) => {
  const response = await api.post('/orders', data);
  return response.data;
};
export const deleteOrder = async (id: string) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};

// Categories
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data.data?.categories || [];
};
export const createCategory = async (data: any) => {
  const response = await api.post('/categories', data);
  return response.data;
};
export const updateCategory = async (id: string, data: any) => {
  const response = await api.patch(`/categories/${id}`, data);
  return response.data;
};
export const deleteCategory = async (id: string) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

// Brands
export const getBrands = async () => {
  const response = await api.get('/brands');
  return response.data.data?.brands || [];
};
export const createBrand = async (data: any) => {
  const response = await api.post('/brands', data);
  return response.data;
};
export const updateBrand = async (id: string, data: any) => {
  const response = await api.patch(`/brands/${id}`, data);
  return response.data;
};
export const deleteBrand = async (id: string) => {
  const response = await api.delete(`/brands/${id}`);
  return response.data;
};

// Product Reviews
export const getReviews = async () => {
  const response = await api.get('/reviews');
  return response.data.data?.reviews || [];
};
export const createReview = async (data: any) => {
  const response = await api.post('/product-reviews', data);
  return response.data;
};
export const deleteReview = async (id: string) => {
  const response = await api.delete(`/product-reviews/${id}`);
  return response.data;
};

// Cart
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};
export const addToCart = async (data: any) => {
  const response = await api.post('/cart', data);
  return response.data;
};
export const clearCart = async () => {
  const response = await api.delete('/cart');
  return response.data;
};

// Vouchers
export const getVouchers = async () => {
  const response = await api.get('/vouchers');
  return response.data.data?.vouchers || [];
};
export const createVoucher = async (data: any) => {
  const response = await api.post('/vouchers', data);
  return response.data;
};

export const updateVoucher = async (id: string, data: any) => {
  const response = await api.patch(`/vouchers/${id}`, data);
  return response.data;
};

export const deleteVoucher = async (id: string) => {
  const response = await api.delete(`/vouchers/${id}`);
  return response.data;
};

// Favorites
export const getFavorites = async () => {
  const response = await api.get('/favorites');
  return response.data.data?.favorites || [];
};
export const addToFavorites = async (data: any) => {
  const response = await api.post('/favorites', data);
  return response.data;
};

// Payments
export const createPayment = async (data: any) => {
  const response = await api.post('/payments', data);
  return response.data;
};

// Admin (ví dụ: lấy dashboard, quản lý user, ...)
export const getAdminDashboard = async (params: { filterType: string }) => {
  const response = await api.get('/admin/dashboard', { params });
  return response.data.data;
};