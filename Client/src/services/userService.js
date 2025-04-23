import api from './api';

export const userService = {
  getProfile: async () => {
    return api.get('/users/me');
  },
  
  updateProfile: async (userData) => {
    return api.put('/users/me', userData);
  },
  
  getUsers: async () => {
    return api.get('/users/all');
  }
};