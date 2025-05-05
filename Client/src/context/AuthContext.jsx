// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../services/api"; 

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      console.log("Sending login request:", credentials.email);
      
      const response = await api.post("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });
      
      console.log("Login response:", response.data);
      
      // if (response.data && response.data.token) {
      //   const userData = {
      //     id: response.data.user.id || response.data.user.user_id,
      //     email: response.data.user.email,
      //     fullName: response.data.user.full_name,
      //     role: response.data.user.role,
      //     token: response.data.token,
      //   };
        
      //   // Set token cho tất cả request sau này
      //   api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
      //   setUser(userData);
      //   localStorage.setItem("user", JSON.stringify(userData));
      //   localStorage.setItem("token", response.data.token);
        
      //   return { success: true, user: userData };
      // }
      if (response.data && (response.data.token || response.data.message === "Login successful" || response.data.user)) {
        const userData = {
          id: response.data.user?.id || response.data.user?.user_id,
          email: response.data.user?.email,
          fullName: response.data.user?.full_name,
          role: response.data.user?.role,
          token: response.data.token || "" // Token có thể không có
        };
        
        // Chỉ set token header nếu có token
        if (response.data.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          localStorage.setItem("token", response.data.token);
        }
        
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        
        return { success: true, user: userData };
      }
      
      return { success: false, error: "Đăng nhập thất bại." };
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response) {
        console.error("Error response:", error.response.data);
        const message = error.response.data?.message || "Đăng nhập thất bại.";
        return { success: false, error: message };
      }
      
      return { success: false, error: "Lỗi kết nối với server." };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", {
        full_name: userData.full_name,
        email: userData.email,
        password: userData.password,
      });
  
      return {
        success: true,
        message: response.data.message,
        userId: response.data.user_id,
      };
    } catch (error) {
      console.log("Registration error:", error.response?.data);
      
      if (error.response?.data?.message) {
        const message = error.response.data.message;
        
        if (message.includes("Email already registered")) {
          return { success: false, error: "Email đã được đăng ký" };
        }
        
        if (message.includes("OTP already sent")) {
          return { 
            success: true, 
            message: "OTP đã được gửi, vui lòng kiểm tra email và xác minh."
          };
        }
      }
  
      return { 
        success: false, 
        error: error.response?.data?.error || "Lỗi đăng ký, vui lòng thử lại sau."
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Xóa token khỏi headers
    delete api.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = () => !!user;

  const forgotPassword = async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return { 
        success: true, 
        message: response.data.message || "Hướng dẫn đặt lại mật khẩu đã được gửi đến email."
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Email không tồn tại trong hệ thống" 
      };
    }
  };

  const resetPassword = async (email, token, newPassword) => {
    try {
      const response = await api.post("/auth/reset-password", { 
        email, 
        token, 
        newPassword 
      });
      return { 
        success: true, 
        message: response.data.message || "Mật khẩu đã được đặt lại thành công" 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Không thể đặt lại mật khẩu" 
      };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await api.post("/auth/verify-otp", { email, otp });
      return { 
        success: true, 
        message: response.data.message || "Email đã được xác minh thành công" 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Mã xác thực không hợp lệ" 
      };
    }
  };

  const resendOTP = async (email) => {
    try {
      const response = await api.post("/auth/resend-otp", { email });
      return {
        success: true,
        message: response.data.message || "OTP đã được gửi lại tới email của bạn",
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || "Không thể gửi lại OTP"
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    forgotPassword,
    resetPassword,
    verifyOTP,
    resendOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;