import React, { createContext, useState, useEffect } from "react";

// Tạo context cho authentication
export const AuthContext = createContext();

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

  // Context value chứa trạng thái và các hàm xử lý
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;