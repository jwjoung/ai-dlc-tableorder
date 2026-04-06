import apiClient from './apiClient';

export const getTables = () =>
  apiClient.get('/tables');

export const createTable = (data) =>
  apiClient.post('/tables', data);

export const updateTable = (id, data) =>
  apiClient.put(`/tables/${id}`, data);

export const completeTable = (id) =>
  apiClient.post(`/tables/${id}/complete`);

export const getTableHistory = (id, dateFilter) => {
  const params = new URLSearchParams();
  if (dateFilter?.from) params.append('from', dateFilter.from);
  if (dateFilter?.to) params.append('to', dateFilter.to);
  const query = params.toString();
  return apiClient.get(`/tables/${id}/history${query ? `?${query}` : ''}`);
};
