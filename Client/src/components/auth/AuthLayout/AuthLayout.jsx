// src/components/auth/AuthLayout/AuthLayout.jsx
import React from 'react';
import './AuthLayout.css';

const AuthLayout = ({ children, title, subtitle, bannerTitle, bannerText }) => {
  return (
    <div className="auth-container">
      <div className="auth-banner">
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <div className="app-logo">DMT HUB</div>
          <h1 className="banner-title">{bannerTitle}</h1>
          <p className="banner-text">{bannerText}</p>
          <div className="banner-features">
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Manage Product Backlog efficiently</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Plan and track Sprints with ease</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Visualize workflow with Kanban boards</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <span>Detailed analytics and reporting</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="auth-form">
        <div className="form-header">
          <h2 className="form-title">{title}</h2>
          <p className="form-subtitle">{subtitle}</p>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;