// Cập nhật file: src/services/api.js
import axios from "axios";

// Xác định BASE_URL từ biến môi trường hoặc mặc định
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Thêm timeout để tránh request treo
});

// Interceptor để thêm token vào headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor xử lý response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Kiểm tra lỗi 401 (Unauthorized) và xử lý nếu cần
    if (error.response && error.response.status === 401) {
      // Token hết hạn, đăng xuất người dùng
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;