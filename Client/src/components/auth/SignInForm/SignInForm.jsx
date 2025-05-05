// src/components/auth/SignInForm/SignInForm.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import "./SignInForm.css";

const SignInForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Đang gửi yêu cầu đăng nhập với:", formData);
  
    setErrors({});

    // Validate form
    let isValid = true;
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Sending login request:", formData.email);
      
      const result = await login({
        email: formData.email,
        password: formData.password,
      });
      console.log("Kết quả đăng nhập:", result);

      if (result.success) {
        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        // Display appropriate error message based on the error
        if (result.error.includes("không tồn tại")) {
          setErrors({ email: result.error });
        } else if (result.error.includes("mật khẩu")) {
          setErrors({ password: result.error });
        } else if (result.error.includes("khóa")) {
          setErrors({ general: result.error });
        } else if (result.error.includes("xác minh")) {
          setErrors({ 
            general: "Tài khoản chưa xác minh. Vui lòng kiểm tra email để xác minh tài khoản." 
          });
        } else {
          setErrors({ general: result.error });
        }
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      setErrors({ general: "Lỗi đăng nhập. Vui lòng thử lại sau." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sign-in-form">
      {errors.general && <div className="error-message">{errors.general}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-control ${errors.email ? 'input-error' : ''}`}
            placeholder="Nhập email của bạn"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="field-error-message">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Mật khẩu</label>
          <input
            type="password"
            id="password"
            name="password"
            className={`form-control ${errors.password ? 'input-error' : ''}`}
            placeholder="Nhập mật khẩu của bạn"
            value={formData.password}
            onChange={handleChange}
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
            <label htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
          </div>
          <Link to="/forgot-password" className="forgot-password">
            Quên mật khẩu?
          </Link>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>

      <div className="form-bottom">
        <p>
          Chưa có tài khoản?{" "}
          <Link to="/signup" className="signup-link">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;