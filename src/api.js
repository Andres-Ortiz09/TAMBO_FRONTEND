import axios from 'axios';

const API_URL = "https://tambo-backend.onrender.com/auth";

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data; // data.accessToken
};

export const register = async (form) => {
  const response = await axios.post(`${API_URL}/register`, form);
  return response.data;
};

export const getCurrentUser = async (token) => {
  const response = await axios.get("https://tambo-backend.onrender.com/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // devuelve el objeto User
};

const API = axios.create({
  baseURL: 'https://tambo-backend.onrender.com/api',
});

// Si usas JWT
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;