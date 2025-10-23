import axios from 'axios';

const API_URL = "http://localhost:8080/auth";

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data; // data.accessToken
};

export const register = async (form) => {
  const response = await axios.post(`${API_URL}/register`, form);
  return response.data;
};

export const getCurrentUser = async (token) => {
  const response = await axios.get("http://localhost:8080/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // devuelve el objeto User
};