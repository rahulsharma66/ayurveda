import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// admin/src/services/api.js

// ... your other code ...

export const getCategories = async () => {
  // 👇 Notice the /api/ prefix added here
  const response = await api.get('/api/categories'); 
  return response.data;
};

export const createCategory = async (categoryData) => {
  // 👇 Notice the /api/ prefix added here
  const response = await api.post('/api/categories', categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  // 👇 Notice the /api/ prefix added here
  const response = await api.delete(`/api/categories/${id}`);
  return response.data;
};

export const getIngredients = async () => {
  const response = await api.get("/api/ingredients");
  return response.data;
};

export default api;