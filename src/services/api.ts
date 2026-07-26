import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.liragames.com.br'
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('lira_token') || localStorage.getItem('lira_token') || localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
