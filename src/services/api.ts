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
export const getUsers = async (page = 1, limit = 10) => {
  const response = await api.get('/users', { params: { page, limit } });
  return response.data;
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
export const getProducts = async (page = 1, limit = 10) => {
  const response = await api.get('/products', { params: { page, limit } });
  return response.data;
};
export const getProduct = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};
export const createProduct = async (data: any) => {
  let formData: FormData;
  if (data instanceof FormData) {
    formData = data;
  } else {
    formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as any);
    });
  }
  const response = await api.post('/products', formData, {
    headers: { 'Content-Type': undefined },
  });
  return response.data;
};
export const updateProduct = async (id: string, data: any) => {
  let formData: FormData;
  if (data instanceof FormData) {
    formData = data;
  } else {
    formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as any);
    });
  }
  const response = await api.patch(`/products/${id}`, formData, {
    headers: { 'Content-Type': undefined },
  });
  return response.data;
};
export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Orders
export const getOrders = async (page = 1, limit = 10) => {
  const response = await api.get('/orders', { params: { page, limit } });
  return response.data;
};
export const createOrder = async (data: any) => {
  const response = await api.post('/orders', data);
  return response.data;
};
export const deleteOrder = async (id: string) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};
export const getOrderDetail = async (id: string) => {
  const response = await api.get(`/orders/${id}/detail`);
  return response.data.data;
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
export const getReviews = async (page = 1, limit = 10) => {
  const response = await api.get('/product-reviews', { params: { page, limit } });
  return response.data;
};
export const createReview = async (data: any) => {
  const response = await api.post('/product-reviews', data);
  return response.data;
};
export const deleteReview = async (id: string) => {
  const response = await api.delete(`/product-reviews/${id}`);
  return response.data;
};
export const replyReview = async (id: string, adminReply: string) => {
  const response = await api.patch(`/product-reviews/${id}/reply`, { adminReply });
  return response.data;
};

// Review admin replies
export const addAdminReply = async (id: string, content: string) => {
  const response = await api.post(`/product-reviews/${id}/admin-replies`, { content });
  return response.data;
};
export const editAdminReply = async (id: string, replyIndex: number, content: string) => {
  const response = await api.patch(`/product-reviews/${id}/admin-replies`, { replyIndex, content });
  return response.data;
};
export const deleteAdminReply = async (id: string, replyIndex: number) => {
  const response = await api.delete(`/product-reviews/${id}/admin-replies`, { data: { replyIndex } });
  return response.data;
};
// Voucher status/conditions
export const setVoucherStatus = async (id: string, status: string) => {
  const response = await api.patch(`/vouchers/${id}/status`, { status });
  return response.data;
};
export const updateVoucherConditions = async (id: string, conditions: any) => {
  const response = await api.patch(`/vouchers/${id}/conditions`, { conditions });
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
export const getVouchers = async (page = 1, limit = 10) => {
  const response = await api.get('/vouchers', { params: { page, limit } });
  return response.data;
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
export const getAdminDashboard = async (params: { filterType: string; year?: number; month?: number }) => {
  const response = await api.get('/admin/dashboard', { params });
  return response.data.data;
};

export const getNotifications = async () => {
  const response = await api.get('/orders/notifications');
  return response.data.data;
};

export const searchAll = async (query: string, type: string = 'all') => {
  const response = await api.get('/orders/search', { params: { query, type } });
  return response.data.data;
};

// News APIs
export const getNews = async () => {
  const res = await api.get('/news');
  // Nếu backend trả về { data: [...] }
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data.data)) return res.data.data;
  if (Array.isArray(res.data.news)) return res.data.news;
  return [];
};

export const getNewsById = async (id: string) => {
  const res = await api.get(`/news/${id}`);
  return res.data;
};

export const createNews = async (data: any) => {
  let formData: FormData;
  if (data instanceof FormData) {
    formData = data;
  } else {
    formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as any);
    });
  }
  const res = await api.post('/news', formData, {
    headers: { 'Content-Type': undefined },
  });
  return res.data;
};

export const updateNews = async (id: string, data: any) => {
  let formData: FormData;
  if (data instanceof FormData) {
    formData = data;
  } else {
    formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as any);
    });
  }
  const res = await api.patch(`/news/${id}`, formData, {
    headers: { 'Content-Type': undefined },
  });
  return res.data;
};

export const deleteNews = async (id: string) => {
  const res = await api.delete(`/news/${id}`);
  return res.data;
};