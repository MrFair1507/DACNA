// src/pages/auth/VerifyEmailPage/VerifyEmailPage.jsx
import React from 'react';
import './VerifyEmailPage.css';
import AuthLayout from '../../../components/auth/AuthLayout/AuthLayout';
  import VerifyEmailForm from '../../../components/auth/VerifyForm/VerifyEmailForm';

const VerifyEmailPage = () => {
  return (
    <div className="verify-email-page">
      <AuthLayout 
        title="Xác thực email"
        subtitle="Nhập mã xác thực để hoàn tất quá trình đăng ký"
        bannerTitle="Xác minh tài khoản"
        bannerText="Cảm ơn bạn đã đăng ký. Để bảo đảm an toàn, chúng tôi cần xác minh email của bạn."
      >
        <VerifyEmailForm/>
      </AuthLayout>
    </div>
  );
};

export default VerifyEmailPage;