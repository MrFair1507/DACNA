import React, { createContext, useState, useEffect } from "react";
import api from "../services/api"; // Import API service

export const AuthContext = createContext();

// ================= MOCK APIs =================

const MOCK_USERS = [
  {
    email: "user@example.com",
    password: "password123",
    isVerified: true,
    status: "active",
  },
  {
    email: "admin@example.com",
    password: "admin123",
    isVerified: true,
    status: "active",
  },
  {
    email: "test@test.com",
    password: "test123",
    isVerified: false,
    status: "active",
  },
  {
    email: "nguyenvana@gmail.com",
    password: "123456",
    isVerified: true,
    status: "blocked",
  },
  {
    email: "tranthib@yahoo.com",
    password: "abc@123",
    isVerified: true,
    status: "active",
  },
];

const simulateLoginApi = (credentials) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = MOCK_USERS.find((u) => u.email === credentials.email);
      if (!user) {
        resolve({
          success: false,
          error: "Email không tồn tại trong hệ thống",
        });
      } else if (user.password !== credentials.password) {
        resolve({ success: false, error: "Mật khẩu không chính xác" });
      } else if (!user.isVerified) {
        resolve({ success: false, error: "Tài khoản chưa được xác minh" });
      } else if (user.status === "blocked") {
        resolve({ success: false, error: "Tài khoản đã bị khóa" });
      } else {
        const userInfo = {
          id: user.id || Math.floor(Math.random() * 1000),
          email: user.email,
          name: user.name || user.email.split("@")[0],
          role: user.role || "user",
        };
        resolve({ success: true, user: userInfo });
      }
    }, 500);
  });
};

const requestOTP = (phoneNumber) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!/^\d{10}$/.test(phoneNumber)) {
        resolve({ success: false, error: "Số điện thoại không hợp lệ" });
        return;
      }
      console.log(`[Mô phỏng] Đã gửi OTP đến số điện thoại ${phoneNumber}`);
      resolve({
        success: true,
        message: "Mã OTP đã được gửi đến số điện thoại của bạn",
      });
    }, 1000);
  });
};

const verifyOTPApi = (phoneNumber, otp) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (otp === "123456") {
        resolve({
          success: true,
          user: {
            id: Math.floor(Math.random() * 1000),
            phoneNumber,
            name: `User_${phoneNumber.slice(-4)}`,
            role: "user",
          },
        });
      } else {
        resolve({ success: false, error: "Mã OTP không chính xác" });
      }
    }, 800);
  });
};

const registerUserApi = (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (userData.method === "email") {
        const emailExists = MOCK_USERS.some(
          (user) => user.email === userData.email
        );
        if (emailExists) {
          resolve({ success: false, error: "Email đã được sử dụng" });
        } else {
          console.log(
            `[Mô phỏng] Đã gửi mã xác minh đến email ${userData.email}`
          );
          resolve({
            success: true,
            message: "Đã gửi mã xác minh đến email của bạn",
          });
        }
      } else if (userData.method === "phone") {
        if (userData.step === "final") {
          resolve({
            success: true,
            user: {
              id: Math.floor(Math.random() * 1000),
              phoneNumber: userData.phoneNumber,
              nickname: userData.nickname,
              role: "user",
            },
          });
        } else {
          console.log(
            `[Mô phỏng] Đã gửi OTP đến số điện thoại ${userData.phoneNumber}`
          );
          resolve({
            success: true,
            message: "Đã gửi mã OTP đến số điện thoại của bạn",
          });
        }
      }
    }, 1000);
  });
};

const verifyEmailApi = (email, code) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (code === "123456") {
        resolve({
          success: true,
          message: "Email đã được xác minh thành công",
        });
      } else {
        resolve({ success: false, error: "Mã xác minh không chính xác" });
      }
    }, 800);
  });
};

// ================ AUTH CONTEXT ================

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
      const response = await api.post("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });

      if (response.data?.token) {
        const userData = {
          id: response.data.user.id || response.data.user.user_id,
          email: response.data.user.email,
          fullName: response.data.user.full_name,
          role: response.data.user.role,
          token: response.data.token,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", response.data.token);

        return { success: true, user: userData };
      }

      return { success: false, error: "Đăng nhập thất bại." };
    } catch (error) {
      console.error("Login error:", error);

      // Xử lý mã lỗi từ server
      if (error.response) {
        const message = error.response.data?.message || "Đăng nhập thất bại.";
        return { success: false, error: message };
      }

      return { success: false, error: "Lỗi kết nối với server." };
    }
  };

  // Tương tự cập nhật các hàm khác như register, verifyOTP...

  // const register = async (userData) => {
  //   try {
  //     try {
  //       const response = await api.post('/auth/register', {
  //         full_name: userData.full_name,
  //         email: userData.email,
  //         password: userData.password
  //       });

  //       if (response.data) {
  //         return {
  //           success: true,
  //           message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực.",
  //           userId: response.data.user_id
  //         };
  //       }

  //       return { success: false, error: "Lỗi đăng ký" };
  //     } catch (error) {
  //       const existingUser = MOCK_USERS.find(u => u.email === userData.email);
  //       if (existingUser) {
  //         return { success: false, error: "Email đã được đăng ký" };
  //       }
  //       return {
  //         success: true,
  //         message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực.",
  //         userId: Math.floor(Math.random() * 1000)
  //       };
  //     }
  //   } catch (error) {
  //     return { success: false, error: error.message || "Lỗi đăng ký" };
  //   }
  // };
  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", {
        full_name: userData.full_name,
        email: userData.email,
        password: userData.password,
      });
  
      // Success response from server
      return {
        success: true,
        message: response.data.message,
        userId: response.data.user_id,
      };
    } catch (error) {
      console.log("Registration error:", error.response?.data);
      
      // Check specific error messages
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
  
      // Generic error
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
  };

  const isAuthenticated = () => !!user;

  const forgotPassword = async (email) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user) {
      return { success: false, error: "Email không tồn tại trong hệ thống" };
    }
    const resetToken = Math.random().toString(36).substring(2, 15);
    console.log(`Reset token for ${email}: ${resetToken}`);
    return {
      success: true,
      message: "Hướng dẫn đặt lại mật khẩu đã được gửi đến email.",
    };
  };

  const resetPassword = async (email, token, newPassword) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const userIndex = MOCK_USERS.findIndex((u) => u.email === email);
    if (userIndex === -1) {
      return { success: false, error: "Email không tồn tại trong hệ thống" };
    }
    MOCK_USERS[userIndex].password = newPassword;
    return { success: true, message: "Mật khẩu đã được đặt lại thành công" };
  };

  const verifyOTP = async (email, otp) => {
    try {
      await api.post("/auth/verify-otp", { email, otp });
      return { success: true, message: "Email đã được xác minh thành công" };
    } catch {
      return {
        success: true,
        message: "Email đã được xác minh thành công (simulated)",
      };
    }
  };

  const resendOTP = async (email) => {
    try {
      await api.post("/auth/resend-otp", { email });
      return {
        success: true,
        message: "OTP đã được gửi lại tới email của bạn",
      };
    } catch {
      return { success: true, message: "OTP đã được gửi lại (simulated)" };
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
    simulateLoginApi,
    requestOTP,
    verifyOTPApi,
    registerUserApi,
    verifyEmailApi,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
