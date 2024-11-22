import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const apiRequest = axios.create({
  baseURL: `${API_URL}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiRequest;