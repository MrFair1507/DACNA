// src/components/auth/OAuthLogin.jsx
import React from 'react';

const OAuthLogin = () => {
  const handleOAuthLogin = (provider) => {
    window.location.href = `http://localhost:3000/api/auth/${provider}`;
  };

  return (
    <div className="oauth-options">
      <button className="oauth-btn google-btn" onClick={() => handleOAuthLogin("google")}>
        <i className="oauth-icon">G</i> Đăng nhập bằng Google
      </button>
      <button className="oauth-btn facebook-btn" onClick={() => handleOAuthLogin("facebook")}>
        <i className="oauth-icon">f</i> Đăng nhập bằng Facebook
      </button>
    </div>
  );
};

export default OAuthLogin;
