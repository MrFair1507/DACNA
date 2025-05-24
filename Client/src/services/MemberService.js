// Client/src/services/memberService.js
import api from './api';

export const memberService = {
  // Lấy danh sách thành viên của dự án
  getProjectMembers: async (projectId) => {
    try {
      // Tạm thời sử dụng endpoint giả, bạn có thể tạo endpoint này trong backend
      const response = await api.get(`/projects/${projectId}`, { withCredentials: true });
      
      // Giả sử trả về thông tin dự án bao gồm thành viên
      // Bạn có thể tạo endpoint riêng: GET /projects/:id/members
      return { 
        success: true, 
        data: response.data.members || [] 
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách thành viên'
      };
    }
  },

  // Thêm thành viên vào dự án (sử dụng API có sẵn)
  addMemberToProject: async (projectId, memberData) => {
    try {
      const response = await api.post('/dashboard/add-member', {
        project_id: projectId,
        email_or_name: memberData.email_or_name,
        role_name: memberData.role_name
      }, { withCredentials: true });

      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Có lỗi xảy ra khi thêm thành viên'
      };
    }
  },

  // Lấy tất cả users (để chọn từ danh sách)
  getAllUsers: async () => {
    try {
      const response = await api.get('/users', { withCredentials: true });
      return { 
        success: true, 
        data: response.data || [] 
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách người dùng'
      };
    }
  },

  // Lấy danh sách roles
  getRoles: async () => {
    try {
      const response = await api.get('/roles', { withCredentials: true });
      return { 
        success: true, 
        data: response.data || [] 
      };
    } catch (error) {
      // Trả về roles mặc định nếu không fetch được
      return {
        success: true,
        data: [
          { role_id: 1, role_name: "Project Manager", role_description: "Quản lý dự án" },
          { role_id: 2, role_name: "Backend Developer", role_description: "Phát triển backend" },
          { role_id: 3, role_name: "Frontend Developer", role_description: "Phát triển frontend" },
          { role_id: 4, role_name: "UI/UX Designer", role_description: "Thiết kế UI/UX" },
          { role_id: 5, role_name: "Tester", role_description: "Kiểm thử" },
        ]
      };
    }
  },

  // Xóa thành viên khỏi dự án (cần tạo endpoint này trong backend)
  removeMemberFromProject: async (projectId, userId) => {
    try {
      // Endpoint này cần được tạo trong backend
      // DELETE /projects/:projectId/members/:userId
      const response = await api.delete(`/projects/${projectId}/members/${userId}`, { 
        withCredentials: true 
      });
      
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Có lỗi xảy ra khi xóa thành viên'
      };
    }
  },

  // Thay đổi role của thành viên (cần tạo endpoint này trong backend)  
  updateMemberRole: async (projectId, userId, newRole) => {
    try {
      // Endpoint này cần được tạo trong backend
      // PUT /projects/:projectId/members/:userId/role
      const response = await api.put(`/projects/${projectId}/members/${userId}/role`, {
        role_name: newRole
      }, { withCredentials: true });
      
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật vai trò'
      };
    }
  }
};

export default memberService;