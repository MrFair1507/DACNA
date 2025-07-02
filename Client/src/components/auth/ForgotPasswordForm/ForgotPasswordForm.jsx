import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import "./ForgotPasswordForm.css";

// Import mock users for sample display only
const MOCK_USERS = [
  { email: "user@example.com", password: "password123" },
  { email: "admin@example.com", password: "admin123" },
  { email: "test@test.com", password: "test123" },
  { email: "nguyenvana@gmail.com", password: "123456" },
  { email: "tranthib@yahoo.com", password: "abc@123" }
];

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP và mật khẩu mới
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'otp':
        setOtp(value);
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      if (step === 1) {
        // Bước 1: Gửi email để nhận OTP
        const result = await forgotPassword(email);
        if (!result.success) {
          setError(result.error);
        } else {
          setSuccessMessage("Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra và nhập mã.");
          setStep(2);
        }
      } else {
        // Bước 2: Xác thực OTP và đặt lại mật khẩu
        if (newPassword !== confirmPassword) {
          setError("Mật khẩu xác nhận không khớp");
          return;
        }
        if (newPassword.length < 6) {
          setError("Mật khẩu phải có ít nhất 6 ký tự");
          return;
        }
        const result = await resetPassword(email, otp, newPassword);
        if (!result.success) {
          setError(result.error);
        } else {
          setSuccessMessage("Đặt lại mật khẩu thành công!");
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        }
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
        {step === 1 
          ? "Nhập email của bạn và chúng tôi sẽ gửi cho bạn mã OTP để đặt lại mật khẩu."
          : "Nhập mã OTP và mật khẩu mới của bạn."
        }
      </p>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        {step === 1 ? (
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
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="otp" className="form-label">
                Mã OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                className="form-control"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                Mật khẩu mới
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="form-control"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? "Đang xử lý..." 
            : (step === 1 ? "Gửi yêu cầu" : "Đặt lại mật khẩu")
          }
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