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

// If the token is missing, expired, or the user no longer exists,
// clear the session and send them to the login page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 && !error.config?.url?.includes("/api/auth/login")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

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