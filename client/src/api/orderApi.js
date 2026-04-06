import apiClient from './apiClient';

export const createOrder = (items) =>
  apiClient.post('/orders', { items });

export const getMyOrders = () =>
  apiClient.get('/orders');

export const getAllOrders = () =>
  apiClient.get('/orders/admin');

export const updateOrderStatus = (id, status) =>
  apiClient.put(`/orders/${id}/status`, { status });

export const deleteOrder = (id) =>
  apiClient.delete(`/orders/${id}`);
