import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import "./SignInForm.css";

// Dữ liệu mẫu
const MOCK_USERS = [
  { email: "user@example.com", password: "password123" },
  { email: "admin@example.com", password: "admin123" },
  { email: "test@test.com", password: "test123" },
  { email: "nguyenvana@gmail.com", password: "123456" },
  { email: "tranthib@yahoo.com", password: "abc@123" }
];

const SignInForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: ""
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    // Clear the specific field error when user starts typing again
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({
      email: "",
      password: "",
      general: ""
    });

    try {
      // Sử dụng dữ liệu mẫu thay vì gọi API
      const mockLogin = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const user = MOCK_USERS.find(u => u.email === formData.email);
            
            if (!user) {
              resolve({ success: false, error: "Email không tồn tại trong hệ thống" });
            } else if (user.password !== formData.password) {
              resolve({ success: false, error: "Mật khẩu không chính xác" });
            } else {
              // Tạo đối tượng user với đầy đủ thông tin để trả về
              const userInfo = {
                id: Math.floor(Math.random() * 1000),
                email: user.email,
                name: user.email.split('@')[0],
                role: user.email.includes('admin') ? 'admin' : 'user'
              };
              resolve({ success: true, user: userInfo });
            }
          }, 500); // Giả lập độ trễ 500ms
        });
      };

      // Thực hiện đăng nhập mô phỏng
      const result = await mockLogin();
      
      if (result.success) {
        // Quan trọng: Gọi hàm login từ AuthContext để lưu trạng thái người dùng
        await login({ 
          email: formData.email, 
          password: formData.password,
          // Cung cấp dữ liệu mẫu để AuthContext có thể sử dụng
          mockResult: result 
        });
        
        // Hiển thị thông báo đăng nhập thành công
        alert(`Đăng nhập thành công với email: ${result.user.email}`);
        
        // Chuyển hướng đến dashboard
        navigate("/dashboard");
      } else {
        // Xử lý các loại lỗi
        if (result.error.includes("Mật khẩu")) {
          setErrors({
            ...errors,
            password: result.error,
            email: ""
          });
          // Reset mật khẩu
          setFormData({
            ...formData,
            password: ""
          });
        } else if (result.error.includes("Email")) {
          setErrors({
            ...errors,
            email: result.error,
            password: ""
          });
        } else {
          setErrors({
            ...errors,
            general: result.error
          });
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrors({
        ...errors,
        general: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại."
      });
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    alert(`Tính năng đăng nhập bằng ${provider} đang được phát triển`);
  };

  return (
    <div className="sign-in-form">
      {errors.general && <div className="error-message">{errors.general}</div>}

      <div className="social-login">
        <button
          className="social-btn"
          onClick={() => handleSocialLogin("Google")}
        >
          <span className="social-icon">G</span>
          <span>Google</span>
        </button>
        <button
          className="social-btn"
          onClick={() => handleSocialLogin("Microsoft")}
        >
          <span className="social-icon">M</span>
          <span>Microsoft</span>
        </button>
      </div>

      <div className="divider">or continue with email</div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-control ${errors.email ? 'input-error' : ''}`}
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="field-error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={`form-control ${errors.password ? 'input-error' : ''}`}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <div className="field-error-message">{errors.password}</div>}
        </div>

        <div className="form-footer">
          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <Link to="/forgot-password" className="forgot-password">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" className="btn btn-primary">
          Sign In
        </button>
      </form>

      <div className="form-bottom">
        <p>
          Don't have an account?{" "}
          <Link to="/signup" className="signup-link">
            Sign Up
          </Link>
        </p>
      </div>
      
      {/* Hiển thị dữ liệu mẫu để dễ dàng test */}
      <div className="sample-data">
        <h4>Dữ liệu mẫu để test:</h4>
        <ul>
          {MOCK_USERS.map((user, index) => (
            <li key={index}>
              Email: <strong>{user.email}</strong> | Password: <strong>{user.password}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SignInForm;