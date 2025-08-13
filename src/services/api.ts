import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Debug log để kiểm tra headers
  console.log('🔍 API Request:', {
    url: config.url,
    method: config.method,
    hasToken: !!token,
    headers: config.headers,
    contentType: config.headers['Content-Type']
  });
  
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
  if (data instanceof FormData) {
    // Đảm bảo token được gửi đúng cách
    const token = localStorage.getItem('token');
    const headers: any = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await api.patch(`/admin/users/${id}`, data, {
      headers: headers,
    });
    return response.data;
  } else {
    const response = await api.patch(`/admin/users/${id}`, data);
    return response.data;
  }
};

export const updateUserStatus = async (id: string, status: string) => {
  const response = await api.patch(`/users/${id}/status`, { status });
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
export const getProducts = async (page = 1, limit = 10, filters: any = {}) => {
  const response = await api.get('/products', {
    params: {
      page,
      limit,
      ...filters,
    },
  });
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
  
  // Đảm bảo token được gửi đúng cách
  const token = localStorage.getItem('token');
  const headers: any = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Debug logging
  console.log('🔍 Creating product with FormData:');
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value);
  }
  console.log('🔍 Headers:', headers);
  
  // Không set Content-Type cho FormData, để browser tự động set
  const response = await api.post('/products', formData, {
    headers: headers,
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
  
  // Đảm bảo token được gửi đúng cách
  const token = localStorage.getItem('token');
  const headers: any = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Không set Content-Type cho FormData, để browser tự động set
  const response = await api.patch(`/products/${id}`, formData, {
    headers: headers,
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
export const updateOrderStatus = async (id: string, status: string) => {
  const response = await api.patch(`/orders/${id}/status`, { status });
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

export const restoreCategory = async (id: string) => {
  const response = await api.patch(`/categories/${id}/restore`);
  return response.data;
};

export const getAllCategories = async () => {
  const response = await api.get('/categories/admin/all');
  return response.data.data?.categories || [];
};

// Brands
export const getBrands = async () => {
  try {
    const response = await api.get('/brands');
    return response.data.data?.brands || [];
  } catch (error) {
    console.error('❌ Error fetching brands:', error);
    throw error;
  }
};

export const createBrand = async (data: any) => {
  try {
    console.log('🔍 Creating brand with data:', data);
    const response = await api.post('/brands', data);
    console.log('✅ Brand created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating brand:', error);
    console.error('❌ Error response:', error?.response?.data);
    throw error;
  }
};

export const updateBrand = async (id: string, data: any) => {
  try {
    console.log('🔍 Updating brand with data:', { id, data });
    const response = await api.patch(`/brands/${id}`, data);
    console.log('✅ Brand updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating brand:', error);
    console.error('❌ Error response:', error?.response?.data);
    throw error;
  }
};

export const deleteBrand = async (id: string) => {
  try {
    console.log('🔍 Deleting brand:', id);
    const response = await api.delete(`/brands/${id}`);
    console.log('✅ Brand deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error deleting brand:', error);
    console.error('❌ Error response:', error?.response?.data);
    throw error;
  }
};

export const restoreBrand = async (id: string) => {
  try {
    console.log('🔍 Restoring brand:', id);
    const response = await api.patch(`/brands/${id}/restore`);
    console.log('✅ Brand restored successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error restoring brand:', error);
    console.error('❌ Error response:', error?.response?.data);
    throw error;
  }
};

export const getAllBrands = async () => {
  try {
    const response = await api.get('/brands/admin/all');
    return response.data.data?.brands || [];
  } catch (error) {
    console.error('❌ Error fetching all brands:', error);
    throw error;
  }
};

export const getBrandRelatedProductsCount = async (id: string) => {
  try {
    const response = await api.get(`/brands/${id}/related-products-count`);
    return response.data.relatedProducts || 0;
  } catch (error) {
    console.error('❌ Error fetching brand related products count:', error);
    return 0;
  }
};

export const getCategoryRelatedProductsCount = async (id: string) => {
  const response = await api.get(`/categories/${id}/related-products-count`);
  return response.data.relatedProducts;
};

// Product Detail APIs
export const getProductDetail = async (id: string) => {
  const response = await api.get(`/product-details/${id}`);
  return response.data.data;
};

export const getProductWithDetail = async (id: string) => {
  const response = await api.get(`/product-details/product/${id}`);
  return response.data.data;
};

export const createProductDetail = async (data: any) => {
  const response = await api.post('/product-details', data);
  return response.data;
};

export const updateProductDetail = async (id: string, data: any) => {
  const response = await api.patch(`/product-details/${id}`, data);
  return response.data;
};

export const deleteProductDetail = async (id: string) => {
  const response = await api.delete(`/product-details/${id}`);
  return response.data;
};

export const getAllProductDetails = async () => {
  const response = await api.get('/product-details');
  return response.data.data;
};

export const getNews = async (params?: any) => {
  const res = await api.get('/news', { params });
  // Nếu backend trả về { data: [...] }
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data.data)) return res.data.data;
  if (Array.isArray(res.data.news)) return res.data.news;
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
  
  // Đảm bảo token được gửi đúng cách
  const token = localStorage.getItem('token');
  const headers: any = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Debug logging
  console.log('🔍 Creating news with FormData:');
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value);
  }
  console.log('🔍 Headers:', headers);
  
  // Không set Content-Type cho FormData, để browser tự động set
  const res = await api.post('/news', formData, {
    headers: headers,
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
  
  // Đảm bảo token được gửi đúng cách
  const token = localStorage.getItem('token');
  const headers: any = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Debug logging
  console.log('🔍 Updating news with FormData:');
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value);
  }
  console.log('🔍 Headers:', headers);
  
  // Không set Content-Type cho FormData, để browser tự động set
  const res = await api.patch(`/news/${id}`, formData, {
    headers: headers,
  });
  return res.data;
};

export const deleteNews = async (id: string) => {
  const res = await api.delete(`/news/${id}`);
  return res.data;
};

// Reviews
export const getReviews = async (page = 1, limit = 10) => {
  const response = await api.get('/product-reviews', { params: { page, limit } });
  return response.data;
};

export const getReviewsByProduct = async (productId: string, page = 1, limit = 10) => {
  const response = await api.get(`/product-reviews/product/${productId}`, { params: { page, limit } });
  return response.data;
};

export const getReviewsByUser = async (page = 1, limit = 10) => {
  const response = await api.get('/product-reviews/user', { params: { page, limit } });
  return response.data;
};

export const createReview = async (data: { idProduct: string; idOrderDetail: string; rating: number; review?: string }) => {
  const response = await api.post('/product-reviews', data);
  return response.data;
};

export const deleteReview = async (id: string) => {
  const response = await api.delete(`/product-reviews/${id}`);
  return response.data;
};

export const hideReview = async (id: string) => {
  const response = await api.patch(`/product-reviews/${id}/hide`);
  return response.data;
};

export const unhideReview = async (id: string) => {
  const response = await api.patch(`/product-reviews/${id}/unhide`);
  return response.data;
};

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

export const getNotifications = async () => {
  const response = await api.get('/orders/notifications');
  return response.data.data;
};

export const searchAll = async (query: string, type: string = 'all') => {
  const response = await api.get('/orders/search', { params: { query, type } });
  return response.data.data;
};

export const getAdminDashboard = async (params: { filterType: string; year?: number; month?: number }) => {
  const response = await api.get('/admin/dashboard', { params });
  return response.data.data;
};

export const createVoucher = async (data: any) => {
  const response = await api.post('/vouchers', data);
  return response.data;
};

export const deleteVoucher = async (id: string) => {
  const response = await api.delete(`/vouchers/${id}`);
  return response.data;
};

export const getVouchers = async (page = 1, limit = 10) => {
  const response = await api.get('/vouchers', { params: { page, limit } });
  return response.data;
};

export const updateVoucher = async (id: string, data: any) => {
  const response = await api.patch(`/vouchers/${id}`, data);
  return response.data;
};