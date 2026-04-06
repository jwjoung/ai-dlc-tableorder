import apiClient from './apiClient';

export const getMenus = () =>
  apiClient.get('/menus');

export const getMenuById = (id) =>
  apiClient.get(`/menus/${id}`);

export const createMenu = (data) =>
  apiClient.post('/menus', data);

export const updateMenu = (id, data) =>
  apiClient.put(`/menus/${id}`, data);

export const deleteMenu = (id) =>
  apiClient.delete(`/menus/${id}`);

export const updateMenuOrder = (id, direction) =>
  apiClient.put(`/menus/${id}/order`, { direction });

export const getCategories = () =>
  apiClient.get('/categories');

export const createCategory = (data) =>
  apiClient.post('/categories', data);

export const updateCategory = (id, data) =>
  apiClient.put(`/categories/${id}`, data);

export const deleteCategory = (id) =>
  apiClient.delete(`/categories/${id}`);
