// src/components/auth/SignUpForm/SignUpForm.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import "./SignUpForm.css";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [step, setStep] = useState(1); // 1: Nhập thông tin, 2: Xác minh OTP
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register, verifyOTP, resendOTP } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateEmailForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên";
    }
    
    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTPForm = () => {
    const newErrors = {};
    
    if (!formData.otp) {
      newErrors.otp = "Vui lòng nhập mã xác minh";
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = "Mã xác minh phải có 6 số";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      // Đăng ký tài khoản
      if (!validateEmailForm()) return;
      
      setIsSubmitting(true);
      try {
        const result = await register({
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password,
        });
        
        console.log("Registration result:", result);
        
        if (result.success) {
          setStep(2); // Chuyển sang bước xác thực OTP
          setSuccessMessage(result.message || "OTP đã được gửi đến email của bạn. Vui lòng kiểm tra và nhập mã xác thực.");
        } else {
          setErrors({ general: result.error || "Đăng ký không thành công. Vui lòng thử lại." });
        }
      } catch (error) {
        console.error("Registration error:", error);
        setErrors({ general: "Lỗi hệ thống. Vui lòng thử lại sau." });
      } finally {
        setIsSubmitting(false);
      }
    } else if (step === 2) {
      // Xác thực OTP
      if (!validateOTPForm()) return;
      
      setIsSubmitting(true);
      try {
        const result = await verifyOTP(formData.email, formData.otp);
        
        if (result.success) {
          setSuccessMessage("Đăng ký thành công!");
          // Chuyển hướng đến trang đăng nhập
          setTimeout(() => {
            navigate("/signin", { 
              state: { message: "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục." }
            });
          }, 1500);
        } else {
          setErrors({ otp: result.error || "Mã xác thực không đúng." });
        }
      } catch (error) {
        console.error("Verification error:", error);
        setErrors({ general: "Lỗi xác thực. Vui lòng thử lại sau." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Xử lý gửi lại OTP
  const handleResendOTP = async () => {
    try {
      setIsSubmitting(true);
      const result = await resendOTP(formData.email);
      
      if (result.success) {
        setSuccessMessage("Đã gửi lại mã OTP. Vui lòng kiểm tra email của bạn.");
      } else {
        setErrors({ general: result.error || "Không thể gửi lại OTP." });
      }
    } catch (error) {
      setErrors({ general: "Lỗi khi gửi lại OTP." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hiển thị form theo bước
  const renderForm = () => {
    if (step === 1) {
      // Form nhập thông tin đăng ký
      return (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">Họ và tên</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className={`form-control ${errors.fullName ? 'input-error' : ''}`}
              placeholder="Nhập họ và tên của bạn"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <div className="field-error-message">{errors.fullName}</div>}
          </div>

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

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`form-control ${errors.confirmPassword ? 'input-error' : ''}`}
              placeholder="Xác nhận mật khẩu của bạn"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <div className="field-error-message">{errors.confirmPassword}</div>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>
      );
    } else if (step === 2) {
      // Form xác thực OTP
      return (
        <form onSubmit={handleSubmit}>
          <div className="form-info">
            <p>Mã xác minh đã được gửi đến email <strong>{formData.email}</strong></p>
          </div>

          <div className="form-group">
            <label htmlFor="otp" className="form-label">Mã xác minh</label>
            <input
              type="text"
              id="otp"
              name="otp"
              className={`form-control otp-input ${errors.otp ? 'input-error' : ''}`}
              placeholder="Nhập mã 6 số"
              value={formData.otp}
              onChange={handleChange}
              maxLength={6}
            />
            {errors.otp && <div className="field-error-message">{errors.otp}</div>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
          </button>
          
          <div className="resend-otp">
            <button 
              type="button"
              className="resend-link" 
              onClick={handleResendOTP}
              disabled={isSubmitting}
            >
              Gửi lại mã xác thực
            </button>
          </div>
        </form>
      );
    }
    return null;
  };

  return (
    <div className="sign-up-form">
      {errors.general && <div className="error-message">{errors.general}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="step-indicator">
        <div className={`step ${step >= 1 ? "active" : ""}`}>
          <div className={`step-circle ${step > 1 ? "completed" : step === 1 ? "active" : ""}`}>
            {step > 1 ? "✓" : 1}
          </div>
          <span className="step-label">Thông tin</span>
        </div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>
          <div className={`step-circle ${step === 2 ? "active" : ""}`}>
            2
          </div>
          <span className="step-label">Xác minh</span>
        </div>
      </div>

      {renderForm()}

      <div className="form-bottom">
        <p>
          Đã có tài khoản?{" "}
          <Link to="/signin" className="signin-link">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;