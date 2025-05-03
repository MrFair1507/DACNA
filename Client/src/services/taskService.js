// src/services/taskService.js
import api from "./api";

export const taskService = {
  // Lấy tất cả task của một sprint
  getTasks: async (sprintId) => {
    try {
      const response = await api.get(`/tasks?sprint_id=${sprintId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Có lỗi xảy ra khi lấy danh sách công việc",
      };
    }
  },

  // Tạo task mới
  createTask: async (taskData) => {
    try {
      const response = await api.post("/tasks", taskData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Có lỗi xảy ra khi tạo công việc mới",
      };
    }
  },

  // Cập nhật task
  updateTask: async (taskId, taskData) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật công việc",
      };
    }
  },

  // Xóa task
  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Có lỗi xảy ra khi xóa công việc",
      };
    }
  },

  // Phân công task
  assignTask: async (taskId, userId) => {
    try {
      const response = await api.post("/task-assignments", {
        task_id: taskId,
        user_id: userId,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Có lỗi xảy ra khi phân công công việc",
      };
    }
  },

  // Cập nhật tiến độ công việc
  updateTaskProgress: async (assignmentId, progress, status) => {
    try {
      const response = await api.put(`/task-assignments/${assignmentId}`, {
        completion_percentage: progress,
        status,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message || "Có lỗi xảy ra khi cập nhật tiến độ",
      };
    }
  },
};

export default taskService;
