import axios from "axios";

// Base URL backend API
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// otomatis kirim token JWT
api.interceptors.request.use((config) => {
  // ambil token dari localStorage
  const token = localStorage.getItem("token");

  // jika token ada
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
