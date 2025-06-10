// src/services/authService.js
import api from './api';

export const authService = {
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },
  
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },
  
  verifyOTP: async (email, otp) => {
    return api.post('/auth/verify-otp', { email, otp });
  },
  
  resendOTP: async (email) => {
    return api.post('/auth/send-otp', { email });
  },
  
  forgotPassword: async (email) => {
    return api.post('/auth/forgot-password', { email });
  },
  
  resetPassword: async (email, token, newPassword) => {
    return api.post('/auth/reset-password', { email, token, newPassword });
  }
};
