import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import "./ResetPasswordForm.css";

// Import mock users for sample display only
const MOCK_USERS = [
  { email: "user@example.com", password: "password123" },
  { email: "admin@example.com", password: "admin123" },
  { email: "test@test.com", password: "test123" },
  { email: "nguyenvana@gmail.com", password: "123456" },
  { email: "tranthib@yahoo.com", password: "abc@123" }
];

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    general: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    // In a real app, we would verify the token with the backend
    // For this demo, we'll extract email and token from URL params
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    const tokenParam = params.get("token");

    if (!emailParam || !tokenParam) {
      setTokenValid(false);
      setErrors(prevErrors => ({
        ...prevErrors,
        general: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"
      }));
    } else {
      // In a real app, we would verify the token with the backend here
      // For this example, we'll just make sure email is one of our mock users
      const userExists = MOCK_USERS.some(user => user.email === emailParam);
      if (!userExists) {
        setTokenValid(false);
        setErrors(prevErrors => ({
          ...prevErrors,
          general: "Email không tồn tại trong hệ thống"
        }));
      } else {
        setEmail(emailParam);
        setResetToken(tokenParam);
      }
    }
  }, [location.search]); // Removed errors dependency

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear the specific field error when user starts typing again
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({
      password: "",
      confirmPassword: "",
      general: ""
    });

    // Validate password
    if (formData.password.length < 6) {
      setErrors(prevErrors => ({
        ...prevErrors,
        password: "Mật khẩu phải có ít nhất 6 ký tự"
      }));
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setErrors(prevErrors => ({
        ...prevErrors,
        confirmPassword: "Mật khẩu xác nhận không khớp"
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      // Use the resetPassword function from AuthContext
      const result = await resetPassword(email, resetToken, formData.password);
      
      if (!result.success) {
        setErrors(prevErrors => ({
          ...prevErrors,
          general: result.error
        }));
      } else {
        alert(`Mật khẩu cho ${email} đã được đặt lại thành công! Bây giờ bạn có thể đăng nhập.`);
        
        // Navigate to login page
        navigate("/signin");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setErrors(prevErrors => ({
        ...prevErrors,
        general: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại."
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // If token is invalid, show error message
  if (!tokenValid) {
    return (
      <div className="reset-password-form">
        <div className="error-message">
          {errors.general || "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"}
        </div>
        <div className="form-bottom">
          <p>
            <Link to="/forgot-password" className="link">
              Yêu cầu liên kết đặt lại mật khẩu mới
            </Link>
          </p>
          <p>
            <Link to="/signin" className="link">
              Quay lại đăng nhập
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-form">
      <h2 className="form-title">Đặt lại mật khẩu</h2>
      <p className="form-subtitle">
        Tạo mật khẩu mới cho tài khoản <strong>{email}</strong>
      </p>

      {errors.general && <div className="error-message">{errors.general}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Mật khẩu mới
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={`form-control ${errors.password ? 'input-error' : ''}`}
            placeholder="Nhập mật khẩu mới"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <div className="field-error-message">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={`form-control ${errors.confirmPassword ? 'input-error' : ''}`}
            placeholder="Nhập lại mật khẩu mới"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <div className="field-error-message">{errors.confirmPassword}</div>}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </button>
      </form>

      <div className="form-bottom">
        <p>
          <Link to="/signin" className="link">
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordForm;