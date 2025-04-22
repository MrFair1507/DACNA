import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import "./ForgotPasswordForm.css";

// Import the same mock users data for the sample display
const MOCK_USERS = [
  { email: "user@example.com", password: "password123" },
  { email: "admin@example.com", password: "admin123" },
  { email: "test@test.com", password: "test123" },
  { email: "nguyenvana@gmail.com", password: "123456" },
  { email: "tranthib@yahoo.com", password: "abc@123" }
];

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { forgotPassword } = useAuth();

  const handleChange = (e) => {
    setEmail(e.target.value);
    // Clear error when user types
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      // Use the forgotPassword function from AuthContext
      const result = await forgotPassword(email);

      if (!result.success) {
        setError(result.error);
      } else {
        setSuccessMessage(
          "Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến."
        );
        
        // Reset the form
        setEmail("");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setError("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-form">
      <h2 className="form-title">Quên mật khẩu</h2>
      <p className="form-subtitle">
        Nhập email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại mật khẩu.
      </p>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-control ${error ? 'input-error' : ''}`}
            placeholder="Nhập email của bạn"
            value={email}
            onChange={handleChange}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang xử lý..." : "Gửi yêu cầu"}
        </button>
      </form>

      <div className="form-bottom">
        <p>
          Đã nhớ mật khẩu?{" "}
          <Link to="/signin" className="signin-link">
            Quay lại đăng nhập
          </Link>
        </p>
      </div>

      {/* Hiển thị dữ liệu mẫu để dễ dàng test */}
      <div className="sample-data">
        <h4>Dữ liệu mẫu để test:</h4>
        <ul>
          {MOCK_USERS.map((user, index) => (
            <li key={index}>
              Email: <strong>{user.email}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;