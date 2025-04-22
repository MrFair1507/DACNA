import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import "./VerifyEmailForm.css";

const VerifyEmailForm = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, resendOTP } = useAuth();

  // Lấy email từ query params hoặc từ state của react-router
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    
    if (emailParam) {
      setEmail(emailParam);
    } else if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleChange = (e) => {
    // Chỉ cho phép nhập số và giới hạn 6 ký tự
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(value);
    
    // Xóa lỗi khi người dùng nhập
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Kiểm tra xem có email không
    if (!email) {
      setError('Không có email để xác thực. Vui lòng thử lại.');
      return;
    }
    
    // Kiểm tra OTP
    if (otp.length !== 6) {
      setError('Mã OTP phải gồm 6 chữ số');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await verifyOTP(email, otp);
      
      if (result.success) {
        setSuccessMessage(result.message || 'Xác thực email thành công!');
        // Chuyển hướng đến trang đăng nhập sau 3 giây
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      } else {
        setError(result.error || 'Mã OTP không đúng. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setError('');
    setSuccessMessage('');
    
    if (!email) {
      setError('Không có email để gửi lại OTP. Vui lòng thử lại.');
      return;
    }
    
    try {
      const result = await resendOTP(email);
      
      if (result.success) {
        setSuccessMessage('Đã gửi lại mã OTP. Vui lòng kiểm tra email của bạn.');
        // Đặt đếm ngược 60 giây
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(result.error || 'Không thể gửi lại OTP. Vui lòng thử lại sau.');
      }
    } catch (err) {
      console.error('Error resending OTP:', err);
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="verify-email-form">
      <h2 className="form-title">Xác thực email</h2>
      <p className="form-subtitle">
        Vui lòng nhập mã xác thực 6 chữ số đã được gửi đến email <strong>{email || 'của bạn'}</strong>
      </p>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="otp" className="form-label">
            Mã xác thực OTP
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            className={`form-control otp-input ${error ? 'input-error' : ''}`}
            placeholder="Nhập mã 6 chữ số"
            value={otp}
            onChange={handleChange}
            required
            autoComplete="one-time-code"
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting || otp.length !== 6}
        >
          {isSubmitting ? "Đang xử lý..." : "Xác thực"}
        </button>
      </form>

      <div className="resend-otp">
        <button 
          className="resend-link" 
          onClick={handleResendOTP}
          disabled={countdown > 0}
        >
          {countdown > 0 ? `Gửi lại OTP (${countdown}s)` : 'Gửi lại mã xác thực'}
        </button>
      </div>

      <div className="form-bottom">
        <p>
          Quay lại trang{" "}
          <Link to="/signin" className="link">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailForm;