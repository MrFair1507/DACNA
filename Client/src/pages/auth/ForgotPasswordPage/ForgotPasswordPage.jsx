// src/pages/auth/ForgotPasswordPage/ForgotPasswordPage.jsx
import React from 'react';
import './ForgotPasswordPage.css';
import AuthLayout from '../../../components/auth/AuthLayout/AuthLayout';
import ForgotPasswordForm from '../../../components/auth/ForgotPasswordForm/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  return (
    <div className="forgot-password-page">
      <AuthLayout 
        title="Khôi phục mật khẩu"
        subtitle="Chúng tôi sẽ giúp bạn lấy lại mật khẩu"
        bannerTitle="Quên mật khẩu?"
        bannerText="Đừng lo lắng, chúng tôi sẽ giúp bạn khôi phục quyền truy cập vào tài khoản của mình."
      >
        <ForgotPasswordForm />
      </AuthLayout>
    </div>
  );
};

export default ForgotPasswordPage;