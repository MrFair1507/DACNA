// src/pages/auth/SignInPage/SignInPage.jsx
import React from 'react';
import './SignInPage.css';
import AuthLayout from '../../../components/auth/AuthLayout/AuthLayout';
import SignInForm from '../../../components/auth/SignInForm/SignInForm';
const SignInPage = () => {
  return (
    <div className="sign-in-page">
      <AuthLayout 
        title="Sign In"
        subtitle="Sign in to your account to continue"
        bannerTitle="Welcome to Scrum Task Management"
        bannerText="Streamline your agile development process with our comprehensive Scrum management tool."
      >
        <SignInForm />
      </AuthLayout>
    </div>
  );
};

export default SignInPage;