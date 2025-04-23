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

// src/services/userService.js


// src/services/projectService.js
// import api from './api';

// export const projectService = {
//   getProjects: async () => {
//     return api.get('/projects');
//   },
  
//   getProject: async (id) => {
//     return api.get(`/projects/${id}`);
//   },
  
//   createProject: async (projectData) => {
//     return api.post('/projects', projectData);
//   },
  
//   updateProject: async (id, projectData) => {
//     return api.put(`/projects/${id}`, projectData);
//   },
  
//   deleteProject: async (id) => {
//     return api.delete(`/projects/${id}`);
//   }
// };

// src/services/taskService.js
// import api from './api';

// export const taskService = {
//   getTasks: async (projectId) => {
//     return api.get(`/tasks?project_id=${projectId}`);
//   },
  
//   createTask: async (taskData) => {
//     return api.post('/tasks', taskData);
//   },
  
//   updateTask: async (id, taskData) => {
//     return api.put(`/tasks/${id}`, taskData);
//   },
  
//   deleteTask: async (id) => {
//     return api.delete(`/tasks/${id}`);
//   },
  
//   assignTask: async (taskId, userId) => {
//     return api.post('/task-assignments', { task_id: taskId, user_id: userId });
//   }
// };