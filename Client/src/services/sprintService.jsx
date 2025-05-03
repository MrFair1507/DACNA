// src/services/sprintService.js
import api from './api';

export const sprintService = {
  // Lấy danh sách sprint của một dự án
  getSprints: async (projectId) => {
    try {
      const response = await api.get(`/sprints?project_id=${projectId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách sprint'
      };
    }
  },

  // Tạo sprint mới
  createSprint: async (sprintData) => {
    try {
      const response = await api.post('/sprints', sprintData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Có lỗi xảy ra khi tạo sprint mới'
      };
    }
  },

  // Cập nhật sprint
  updateSprint: async (sprintId, sprintData) => {
    try {
      const response = await api.put(`/sprints/${sprintId}`, sprintData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sprint'
      };
    }
  },

  // Kết thúc/hoàn thành sprint
  completeSprint: async (sprintId) => {
    try {
      const response = await api.put(`/sprints/${sprintId}/complete`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Có lỗi xảy ra khi hoàn thành sprint'
      };
    }
  },

  // Lấy chi tiết sprint bao gồm tasks
  getSprintDetails: async (sprintId) => {
    try {
      const response = await api.get(`/sprints/${sprintId}/details`);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Có lỗi xảy ra khi lấy chi tiết sprint'
      };
    }
  }
};

export default sprintService;