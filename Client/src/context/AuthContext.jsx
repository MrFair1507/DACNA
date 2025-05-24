import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    console.log("Bootstrapping Auth...");
    console.log("Stored user:", storedUser);
    console.log("Stored token:", storedToken);

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser.user_id && parsedUser.id) {
          parsedUser.user_id = parsedUser.id;
        }
        setUser(parsedUser);

        // ✅ Gán lại token vào axios nếu có
        if (storedToken) {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
        }
        if (storedToken) {
          api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
          console.log("✅ Token rehydrated into axios headers:", storedToken);
        }
        
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post(
        "/auth/login",
        {
          email: credentials.email,
          password: credentials.password,
        },
        { withCredentials: true } // 🔥 thêm dòng này
      );

      if (response.data && (response.data.token || response.data.user)) {
        const userData = {
          user_id: response.data.user?.user_id || response.data.user?.id,
          email: response.data.user?.email,
          fullName: response.data.user?.full_name,
          role: response.data.user?.role,
          token: response.data.token || "",
        };

        if (response.data.token) {
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.token}`;
          localStorage.setItem("token", response.data.token);
          console.log("Saved token:", response.data.token);
          console.log("Saved user:", userData);
          console.log(
            "Check token in localStorage:",
            localStorage.getItem("token")
          );
        }

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        return { success: true, user: userData };
      }

      return { success: false, error: "Đăng nhập thất bại." };
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.data?.message) {
        return { success: false, error: error.response.data.message };
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
      if (error.response?.data?.message?.includes("Email already registered")) {
        return { success: false, error: "Email đã được đăng ký" };
      }

      if (error.response?.data?.message?.includes("OTP already sent")) {
        return {
          success: true,
          message: "OTP đã được gửi, vui lòng kiểm tra email và xác minh.",
        };
      }

      return {
        success: false,
        error:
          error.response?.data?.error || "Lỗi đăng ký, vui lòng thử lại sau.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  const isAuthenticated = () => !!user;

  const forgotPassword = async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return {
        success: true,
        message:
          response.data.message ||
          "Hướng dẫn đặt lại mật khẩu đã được gửi đến email.",
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Email không tồn tại trong hệ thống",
      };
    }
  };

  const resetPassword = async (email, token, newPassword) => {
    try {
      const response = await api.post("/auth/reset-password", {
        email,
        token,
        newPassword,
      });
      return {
        success: true,
        message: response.data.message || "Mật khẩu đã được đặt lại thành công",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Không thể đặt lại mật khẩu",
      };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await api.post("/auth/verify-otp", { email, otp });
      return {
        success: true,
        message: response.data.message || "Email đã được xác minh thành công",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Mã xác thực không hợp lệ",
      };
    }
  };

  const resendOTP = async (email) => {
    try {
      const response = await api.post("/auth/resend-otp", { email });
      return {
        success: true,
        message:
          response.data.message || "OTP đã được gửi lại tới email của bạn",
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Không thể gửi lại OTP",
      };
    }
  };

  const value = {
  user,
  setUser, // 👈 thêm dòng này
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
