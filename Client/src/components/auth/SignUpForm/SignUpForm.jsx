// src/components/auth/SignUpForm/SignUpForm.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import "./SignUpForm.css";

const SignUpForm = () => {
  const [registrationMethod, setRegistrationMethod] = useState("email"); // "email", "phone", "oauth"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    nickname: "",
    otp: "",
  });
  const [step, setStep] = useState(1); // 1: Initial input, 2: Verification, 3: Account setup
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { register, verifyEmail, verifyOTP, oauthLogin } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
    setRegistrationMethod(method);
    setErrors({});
    setStep(1);
  };

  const validateEmailForm = () => {
    const newErrors = {};
    
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

  const validatePhoneForm = () => {
    const newErrors = {};
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại";
    } else if (!/^\d{10,11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateVerificationForm = () => {
    const newErrors = {};
    
    if (!formData.otp) {
      newErrors.otp = "Vui lòng nhập mã xác minh";
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = "Mã xác minh phải có 6 số";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNicknameForm = () => {
    const newErrors = {};
    
    if (!formData.nickname) {
      newErrors.nickname = "Vui lòng nhập nickname";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailRegistrationSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate email registration form
      if (!validateEmailForm()) return;
      
      try {
        // Check if email is already in use
        const result = await register({
          email: formData.email,
          password: formData.password,
          method: "email"
        });
        
        if (result.success) {
          setStep(2); // Move to verification step
        } else {
          setErrors({ email: result.error || "Email đã được sử dụng" });
        }
      } catch (error) {
        setErrors({ general: "Lỗi đăng ký. Vui lòng thử lại sau." });
      }
    } else if (step === 2) {
      // Validate verification code
      if (!validateVerificationForm()) return;
      
      try {
        const result = await verifyEmail(formData.email, formData.otp);
        
        if (result.success) {
          // Redirect to main screen or login page
          navigate("/signin", { 
            state: { message: "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục." }
          });
        } else {
          setErrors({ otp: result.error || "Mã xác minh không chính xác" });
        }
      } catch (error) {
        setErrors({ general: "Lỗi xác minh. Vui lòng thử lại sau." });
      }
    }
  };

  const handlePhoneRegistrationSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate phone registration form
      if (!validatePhoneForm()) return;
      
      try {
        // Register with phone number
        const result = await register({
          phoneNumber: formData.phoneNumber,
          method: "phone"
        });
        
        if (result.success) {
          setStep(2); // Move to verification step
        } else {
          setErrors({ phoneNumber: result.error || "Số điện thoại đã được sử dụng" });
        }
      } catch (error) {
        setErrors({ general: "Lỗi đăng ký. Vui lòng thử lại sau." });
      }
    } else if (step === 2) {
      // Validate OTP
      if (!validateVerificationForm()) return;
      
      try {
        const result = await verifyOTP(formData.phoneNumber, formData.otp);
        
        if (result.success) {
          setStep(3); // Move to nickname setup
        } else {
          setErrors({ otp: result.error || "Mã OTP không chính xác" });
        }
      } catch (error) {
        setErrors({ general: "Lỗi xác minh OTP. Vui lòng thử lại sau." });
      }
    } else if (step === 3) {
      // Validate nickname
      if (!validateNicknameForm()) return;
      
      try {
        // Complete registration with nickname
        const result = await register({
          phoneNumber: formData.phoneNumber,
          nickname: formData.nickname,
          method: "phone",
          step: "final"
        });
        
        if (result.success) {
          // Redirect to main screen
          navigate("/dashboard");
        } else {
          setErrors({ general: result.error });
        }
      } catch (error) {
        setErrors({ general: "Lỗi hoàn tất đăng ký. Vui lòng thử lại sau." });
      }
    }
  };

  const handleOauthRegistration = (provider) => {
    oauthLogin(provider);
  };

  // Render different forms based on registration method and step
  const renderRegistrationForm = () => {
    switch (registrationMethod) {
      case "email":
        if (step === 1) {
          // Email registration form
          return (
            <form onSubmit={handleEmailRegistrationSubmit}>
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
                {errors.confirmPassword && (
                  <div className="field-error-message">{errors.confirmPassword}</div>
                )}
              </div>

              <button type="submit" className="btn btn-primary">
                Tiếp tục
              </button>
            </form>
          );
        } else if (step === 2) {
          // Email verification form
          return (
            <form onSubmit={handleEmailRegistrationSubmit}>
              <div className="form-info">
                <p>Mã xác minh đã được gửi đến email {formData.email}</p>
              </div>

              <div className="form-group">
                <label htmlFor="otp" className="form-label">Mã xác minh</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  className={`form-control ${errors.otp ? 'input-error' : ''}`}
                  placeholder="Nhập mã xác minh gửi đến email của bạn"
                  value={formData.otp}
                  onChange={handleChange}
                />
                {errors.otp && <div className="field-error-message">{errors.otp}</div>}
              </div>

              <button type="submit" className="btn btn-primary">
                Xác minh
              </button>
            </form>
          );
        }
        break;

      case "phone":
        if (step === 1) {
          // Phone registration form
          return (
            <form onSubmit={handlePhoneRegistrationSubmit}>
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
                />
                {errors.phoneNumber && <div className="field-error-message">{errors.phoneNumber}</div>}
              </div>

              <button type="submit" className="btn btn-primary">
                Gửi mã OTP
              </button>
            </form>
          );
        } else if (step === 2) {
          // OTP verification form
          return (
            <form onSubmit={handlePhoneRegistrationSubmit}>
              <div className="form-info">
                <p>Mã OTP đã được gửi đến số điện thoại {formData.phoneNumber}</p>
              </div>

              <div className="form-group">
                <label htmlFor="otp" className="form-label">Mã OTP</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  className={`form-control ${errors.otp ? 'input-error' : ''}`}
                  placeholder="Nhập mã OTP gửi đến điện thoại của bạn"
                  value={formData.otp}
                  onChange={handleChange}
                />
                {errors.otp && <div className="field-error-message">{errors.otp}</div>}
              </div>

              <button type="submit" className="btn btn-primary">
                Xác nhận
              </button>
            </form>
          );
        } else if (step === 3) {
          // Nickname setup form
          return (
            <form onSubmit={handlePhoneRegistrationSubmit}>
              <div className="form-group">
                <label htmlFor="nickname" className="form-label">Nickname</label>
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  className={`form-control ${errors.nickname ? 'input-error' : ''}`}
                  placeholder="Nhập nickname của bạn"
                  value={formData.nickname}
                  onChange={handleChange}
                />
                {errors.nickname && <div className="field-error-message">{errors.nickname}</div>}
              </div>

              <button type="submit" className="btn btn-primary">
                Hoàn tất
              </button>
            </form>
          );
        }
        break;

      case "oauth":
        return (
          <div className="oauth-options">
            <button
              className="oauth-btn google-btn"
              onClick={() => handleOauthRegistration("Google")}
            >
              <span className="oauth-icon">G</span>
              <span>Đăng ký với Google</span>
            </button>
            <button
              className="oauth-btn facebook-btn"
              onClick={() => handleOauthRegistration("Facebook")}
            >
              <span className="oauth-icon">f</span>
              <span>Đăng ký với Facebook</span>
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // Thêm vào phần render cuối cùng

  return (
    <div className="sign-up-form">
      {errors.general && <div className="error-message">{errors.general}</div>}

      <div className="registration-method-tabs">
        <button
          className={`method-tab ${registrationMethod === "email" ? "active" : ""}`}
          onClick={() => handleMethodChange("email")}
        >
          Email
        </button>
        <button
          className={`method-tab ${registrationMethod === "phone" ? "active" : ""}`}
          onClick={() => handleMethodChange("phone")}
        >
          Số điện thoại
        </button>
        <button
          className={`method-tab ${registrationMethod === "oauth" ? "active" : ""}`}
          onClick={() => handleMethodChange("oauth")}
        >
          Mạng xã hội
        </button>
      </div>

      {registrationMethod !== "oauth" && (
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            <div className={`step-circle ${step > 1 ? "completed" : step === 1 ? "active" : ""}`}>
              {step > 1 ? "✓" : 1}
              <span className="step-line"></span>
            </div>
            <span className="step-label">
              {registrationMethod === "email" ? "Thông tin" : "Số điện thoại"}
            </span>
          </div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>
            <div className={`step-circle ${step > 2 ? "completed" : step === 2 ? "active" : ""}`}>
              {step > 2 ? "✓" : 2}
              <span className="step-line"></span>
            </div>
            <span className="step-label">Xác minh</span>
          </div>
          {registrationMethod === "phone" && (
            <div className={`step ${step >= 3 ? "active" : ""}`}>
              <div className={`step-circle ${step === 3 ? "active" : ""}`}>
                3
              </div>
              <span className="step-label">Nickname</span>
            </div>
          )}
        </div>
      )}

      {renderRegistrationForm()}

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