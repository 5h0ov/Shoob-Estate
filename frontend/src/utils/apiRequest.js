import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const apiRequest = axios.create({
  baseURL: `${API_URL}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// adding token dynamically
apiRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt-shoobestate');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle errors globally
apiRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error);
    return Promise.reject(error);
  }
);

export default apiRequest;
