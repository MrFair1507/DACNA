// src/pages/auth/SignInPage/SignInPage.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import "./SignInPage.css";
import AuthLayout from "../../../components/auth/AuthLayout/AuthLayout";
import SignInForm from "../../../components/auth/SignInForm/SignInForm";

const SignInPage = () => {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div className="sign-in-page">
      <AuthLayout
        title="Đăng nhập"
        subtitle="Đăng nhập để truy cập vào tài khoản của bạn"
        bannerTitle="Chào mừng trở lại"
        bannerText="Hệ thống quản lý công việc giúp bạn làm việc hiệu quả, tiết kiệm thời gian và tối ưu quy trình làm việc nhóm."
      >
        {message && <div className="auth-message success">{message}</div>}
        <SignInForm />
      </AuthLayout>
    </div>
  );
};

export default SignInPage;
