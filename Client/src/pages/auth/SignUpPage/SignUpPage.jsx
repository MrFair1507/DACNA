// src/pages/auth/SignUpPage/SignUpPage.jsx
import React from 'react';
import './SignUpPage.css';
import AuthLayout from '../../../components/auth/AuthLayout/AuthLayout';
import SignUpForm from '../../../components/auth/SignUpForm/SignUpForm';

const SignUpPage = () => {
  return (
    <div className="sign-up-page">
      <AuthLayout 
        title="Đăng ký tài khoản"
        subtitle="Tạo tài khoản mới để sử dụng hệ thống"
        bannerTitle="Chào mừng đến với Scrum Task Management"
        bannerText="Đăng ký để tham gia quản lý công việc với phương pháp Agile Scrum hiệu quả."
      >
        <SignUpForm />
      </AuthLayout>
    </div>
  );
};

export default SignUpPage;