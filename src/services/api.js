import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.liragames.com.br/api', // Conectando direto na produção
  timeout: 10000,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se receber 401 (Não autorizado), significa que o token expirou ou é inválido
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Força o redirecionamento para o login
    }
    return Promise.reject(error);
  }
);

export default api;
