import axios from 'axios';

const api = axios.create({
  baseURL: 'http://your-backend-api-url', // Thay bằng URL backend của bạn
});

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};