import axios from "axios";

const API_URL = "https://tambo-backend.onrender.com/users";

export const getAllUsers = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createUser = async (token, userData) => {
  const response = await axios.post(API_URL, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUser = async (token, id, userData) => {
  const response = await axios.put(`${API_URL}/${id}`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteUser = async (token, id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
