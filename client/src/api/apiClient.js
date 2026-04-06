import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract data, handle 401
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenRole');

      const role = localStorage.getItem('tokenRole');
      if (role === 'admin') {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/customer/setup';
      }
    }

    const message = error.response?.data?.error?.message || '네트워크 오류가 발생했습니다';
    const code = error.response?.data?.error?.code || 'NETWORK_ERROR';

    return Promise.reject({ message, code });
  }
);

export default apiClient;
