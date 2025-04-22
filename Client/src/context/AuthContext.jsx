import React, { createContext, useState, useEffect } from "react";

// Tạo context cho authentication
export const AuthContext = createContext();

// Dữ liệu mẫu
const MOCK_USERS = [
  { email: "user@example.com", password: "password123" },
  { email: "admin@example.com", password: "admin123" },
  { email: "test@test.com", password: "test123" },
  { email: "nguyenvana@gmail.com", password: "123456" },
  { email: "tranthib@yahoo.com", password: "abc@123" }
];

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra người dùng đã đăng nhập khi tải trang
  useEffect(() => {
    // Kiểm tra localStorage xem có user đã lưu không
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

  // Hàm đăng nhập
  const login = async (credentials) => {
    try {
      // Nếu có mockResult (từ dữ liệu mẫu), sử dụng nó
      if (credentials.mockResult && credentials.mockResult.success) {
        const userData = credentials.mockResult.user;
        
        // Lưu thông tin user vào state và localStorage
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        
        return { success: true, user: userData };
      }
      
      // Logic đăng nhập thật ở đây (gọi API)
      console.log("Đang thực hiện đăng nhập với:", credentials.email);
      
      // Trả về lỗi mặc định nếu không có mockResult
      return { 
        success: false, 
        error: "Vui lòng sử dụng dữ liệu mẫu từ danh sách bên dưới" 
      };
      
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message || "Lỗi đăng nhập" };
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Hàm kiểm tra trạng thái đăng nhập
  const isAuthenticated = () => {
    return !!user;
  };

  // Hàm gửi yêu cầu quên mật khẩu
  const forgotPassword = async (email) => {
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if the email exists in our mock database
      const user = MOCK_USERS.find(u => u.email === email);

      if (!user) {
        return { 
          success: false, 
          error: "Email không tồn tại trong hệ thống" 
        };
      }

      // Generate a mock reset token
      const resetToken = Math.random().toString(36).substring(2, 15);
      
      // In a real app, this would send an email with the reset link
      console.log(`Reset token for ${email}: ${resetToken}`);
      
      return { 
        success: true, 
        message: "Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn"
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      return { 
        success: false, 
        error: error.message || "Lỗi khi gửi yêu cầu đặt lại mật khẩu" 
      };
    }
  };

  // Hàm đặt lại mật khẩu
  const resetPassword = async (email, token, newPassword) => {
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if the email exists in our mock database
      const userIndex = MOCK_USERS.findIndex(u => u.email === email);

      if (userIndex === -1) {
        return { 
          success: false, 
          error: "Email không tồn tại trong hệ thống" 
        };
      }

      // In a real app, we would verify the token here
      // For the mock version, we'll just simulate success
      
      // Update the user's password in our mock DB
      // Note: In a real app, this would happen on the server
      MOCK_USERS[userIndex].password = newPassword;
      
      return { 
        success: true, 
        message: "Mật khẩu đã được đặt lại thành công" 
      };
    } catch (error) {
      console.error("Reset password error:", error);
      return { 
        success: false, 
        error: error.message || "Lỗi khi đặt lại mật khẩu" 
      };
    }
  };

  // Context value chứa trạng thái và các hàm xử lý
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    forgotPassword,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;