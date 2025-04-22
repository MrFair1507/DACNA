// src/pages/auth/ResetPasswordPage/ResetPasswordPage.jsx
import React from 'react';
import './ResetPasswordPage.css';
import AuthLayout from '../../../components/auth/AuthLayout/AuthLayout';
import ResetPasswordForm from '../../../components/auth/ResetPasswordForm/ResetPasswordForm';

const ResetPasswordPage = () => {
  return (
    <div className="reset-password-page">
      <AuthLayout 
        title="Đặt lại mật khẩu"
        subtitle="Tạo mật khẩu mới cho tài khoản của bạn"
        bannerTitle="Bảo mật tài khoản"
        bannerText="Đặt lại mật khẩu của bạn để đảm bảo tài khoản của bạn được bảo mật."
      >
        <ResetPasswordForm />
      </AuthLayout>
    </div>
  );
};

export default ResetPasswordPage;