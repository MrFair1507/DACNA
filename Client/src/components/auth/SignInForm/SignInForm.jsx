// src/components/auth/SignInForm/SignInForm.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import "./SignInForm.css";

const SignInForm = () => {
  const [loginMethod, setLoginMethod] = useState("email"); // "email", "phone", "oauth"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    otp: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithPhone, verifyOTP, oauthLogin } = useAuth();

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

  const handleMethodChange = (method) => {
    setLoginMethod(method);
    setErrors({});
    setOtpSent(false);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
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

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

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
      setErrors({ general: "Lỗi đăng nhập. Vui lòng thử lại sau." });
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!otpSent) {
      // First step: Request OTP
      if (!formData.phoneNumber) {
        setErrors({ phoneNumber: "Vui lòng nhập số điện thoại" });
        return;
      }

      try {
        const result = await loginWithPhone(formData.phoneNumber);
        if (result.success) {
          setOtpSent(true);
        } else {
          setErrors({ phoneNumber: result.error });
        }
      } catch (error) {
        setErrors({ general: "Lỗi gửi OTP. Vui lòng thử lại sau." });
      }
    } else {
      // Second step: Verify OTP
      if (!formData.otp) {
        setErrors({ otp: "Vui lòng nhập mã OTP" });
        return;
      }

      try {
        const result = await verifyOTP(formData.phoneNumber, formData.otp);
        if (result.success) {
          navigate("/dashboard");
        } else {
          setErrors({ otp: result.error || "Mã OTP không chính xác" });
        }
      } catch (error) {
        setErrors({ general: "Lỗi xác thực OTP. Vui lòng thử lại sau." });
      }
    }
  };

  const handleOauthLogin = (provider) => {
    oauthLogin(provider);
  };

  // Render different forms based on login method
  const renderLoginForm = () => {
    switch (loginMethod) {
      case "email":
        return (
          <form onSubmit={handleEmailSubmit}>
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

            <button type="submit" className="btn btn-primary">
              Đăng nhập
            </button>
          </form>
        );

      case "phone":
        return (
          <form onSubmit={handlePhoneSubmit}>
            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                className={`form-control ${errors.phoneNumber ? 'input-error' : ''}`}
                placeholder="Nhập số điện thoại của bạn"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={otpSent}
              />
              {errors.phoneNumber && <div className="field-error-message">{errors.phoneNumber}</div>}
            </div>

            {otpSent && (
              <div className="form-group">
                <label htmlFor="otp" className="form-label">Mã OTP</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  className={`form-control ${errors.otp ? 'input-error' : ''}`}
                  placeholder="Nhập mã OTP đã gửi đến điện thoại của bạn"
                  value={formData.otp}
                  onChange={handleChange}
                />
                {errors.otp && <div className="field-error-message">{errors.otp}</div>}
              </div>
            )}

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
            </div>

            <button type="submit" className="btn btn-primary">
              {otpSent ? "Xác nhận OTP" : "Gửi mã OTP"}
            </button>
          </form>
        );

      case "oauth":
        return (
          <div className="oauth-options">
            <button
              className="oauth-btn google-btn"
              onClick={() => handleOauthLogin("Google")}
            >
              <span className="oauth-icon">G</span>
              <span>Đăng nhập với Google</span>
            </button>
            <button
              className="oauth-btn facebook-btn"
              onClick={() => handleOauthLogin("Facebook")}
            >
              <span className="oauth-icon">f</span>
              <span>Đăng nhập với Facebook</span>
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="sign-in-form">
      {errors.general && <div className="error-message">{errors.general}</div>}

      <div className="login-method-tabs">
        <button
          className={`method-tab ${loginMethod === "email" ? "active" : ""}`}
          onClick={() => handleMethodChange("email")}
        >
          Email
        </button>
        <button
          className={`method-tab ${loginMethod === "phone" ? "active" : ""}`}
          onClick={() => handleMethodChange("phone")}
        >
          Số điện thoại
        </button>
        <button
          className={`method-tab ${loginMethod === "oauth" ? "active" : ""}`}
          onClick={() => handleMethodChange("oauth")}
        >
          Mạng xã hội
        </button>
      </div>

      {renderLoginForm()}

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