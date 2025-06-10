// src/components/auth/OAuthRegisterButtons.jsx
import React from 'react';
import './OAuthRegisterButton.css';

const OAuthRegisterButtons = () => {
  const handleOAuthRegister = (provider) => {
    window.location.href = `http://localhost:3000/api/auth/${provider}`;
  };

  return (
    <div className="oauth-options">
      <button className="oauth-btn google-btn" onClick={() => handleOAuthRegister("google")}>
        <i className="oauth-icon">G</i> Đăng ký bằng Google
      </button>
      <button className="oauth-btn facebook-btn" onClick={() => handleOAuthRegister("facebook")}>
        <i className="oauth-icon">f</i> Đăng ký bằng Facebook
      </button>
    </div>
  );
};

export default OAuthRegisterButtons;
