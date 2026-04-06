import apiClient from './apiClient';

export const adminLogin = (storeIdentifier, username, password) =>
  apiClient.post('/auth/admin/login', { storeIdentifier, username, password });

export const tableLogin = (storeIdentifier, tableNumber, password) =>
  apiClient.post('/auth/table/login', { storeIdentifier, tableNumber, password });

export const verifyToken = () =>
  apiClient.post('/auth/verify');
