import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1'; 

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  },
});

// Users
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Products
export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};
export const createProduct = async (productData: any) => {
  const response = await api.post('/products', productData);
  return response.data;
};
export const updateProduct = async (id: string, productData: any) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};
export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Categories
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};
export const createCategory = async (categoryData: any) => {
  const response = await api.post('/categories', categoryData);
  return response.data;
};
export const updateCategory = async (id: string, categoryData: any) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
};
export const deleteCategory = async (id: string) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

// Orders
export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};
export const updateOrderStatus = async (id: string, status: string) => {
  const response = await api.patch(`/orders/${id}`, { status });
  return response.data;
};

// Reviews
export const getReviews = async () => {
  const response = await api.get('/product-reviews');
  return response.data;
};

// Auth
export const login = async (credentials: { username: string; password: string }) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};
export const register = async (credentials: { username: string; password: string }) => {
  const response = await api.post('/auth/register', credentials);
  return response.data;
};