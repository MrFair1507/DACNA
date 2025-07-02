// Client/src/components/UI/MemberManagement/MemberManagement.jsx
import React, { useState, useEffect } from "react";
import "./MemberManagement.css";
import AddMembersForm from "../AddMembersForm/AddMembersForm";
import api from "../../../services/api";

const MemberManagement = ({ projectId }) => {
  const [showAddMembersForm, setShowAddMembersForm] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch danh sách thành viên hiện tại của dự án
  useEffect(() => {
    if (projectId) {
      fetchProjectMembers();
    }
  }, [projectId]);

  const fetchProjectMembers = async () => {
    try {
      setLoading(true);
      // Gọi API để lấy danh sách thành viên dự án
      const response = await api.get(`/projects/${projectId}/members`, { 
        withCredentials: true 
      });
      
      setMembers(response.data || []);
    } catch (err) {
      console.error("Error fetching project members:", err);
      setError("Không thể tải danh sách thành viên");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMembers = (newMembers, method) => {
    console.log("📥 Thành viên được thêm:", newMembers, "Phương thức:", method);
    
    // Cập nhật danh sách thành viên
    const addedMembers = newMembers.filter(m => m.status === "added");
    if (addedMembers.length > 0) {
      // Re-fetch danh sách thành viên để cập nhật
      fetchProjectMembers();
    }
    
    setShowAddMembersForm(false);
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Bạn có chắc muốn xóa thành viên này khỏi dự án?")) {
      return;
    }

    try {
      await api.delete(`/projects/${projectId}/members/${memberId}`, {
        withCredentials: true
      });
      
      // Cập nhật danh sách sau khi xóa
      setMembers(prev => prev.filter(m => m.user_id !== memberId));
    } catch (err) {
      console.error("Error removing member:", err);
      alert("Có lỗi xảy ra khi xóa thành viên");
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await api.put(`/projects/${projectId}/members/${memberId}/role`, {
        role_name: newRole
      }, { withCredentials: true });
      
      // Cập nhật danh sách sau khi thay đổi role
      setMembers(prev => prev.map(m => 
        m.user_id === memberId ? { ...m, role_name: newRole } : m
      ));
    } catch (err) {
      console.error("Error updating member role:", err);
      alert("Có lỗi xảy ra khi thay đổi vai trò");
    }
  };

  if (loading) {
    return (
      <div className="members-management">
        <div className="loading">Đang tải danh sách thành viên...</div>
      </div>
    );
  }

  return (
    <div className="members-management">
      <div className="members-header">
        <h2>Quản lý thành viên</h2>
        <button
          className="add-members-btn"
          onClick={() => setShowAddMembersForm(true)}
        >
          <span className="btn-icon">+</span>
          <span>Thêm thành viên</span>
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Danh sách thành viên hiện tại */}
      <div className="members-section">
        <h3>Thành viên dự án ({members.length})</h3>
        
        {members.length === 0 ? (
          <div className="empty-state">
            <p>Chưa có thành viên nào trong dự án này</p>
            <button 
              className="add-first-member-btn"
              onClick={() => setShowAddMembersForm(true)}
            >
              Thêm thành viên đầu tiên
            </button>
          </div>
        ) : (
          <div className="members-list">
            {members.map((member) => (
              <div key={member.user_id} className="member-item">
                <div className="member-avatar">
                  {member.full_name ? member.full_name[0].toUpperCase() : "U"}
                </div>
                
                <div className="member-details">
                  <div className="member-name">
                    {member.full_name || "Không có tên"}
                  </div>
                  <div className="member-meta">
                    <span className="member-email">{member.email}</span>
                    {member.status && (
                      <span className={`status-badge status-${member.status.toLowerCase()}`}>
                        {member.status}
                      </span>
                    )}
                  </div>
                </div>

                <div className="member-role">
                  <select
                    className="role-select"
                    value={member.role_name || ""}
                    onChange={(e) => handleRoleChange(member.user_id, e.target.value)}
                  >
                    <option value="Project Manager">Project Manager</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Tester">Tester</option>
                  </select>
                </div>

                <button
                  className="remove-member-btn"
                  onClick={() => handleRemoveMember(member.user_id)}
                  title="Xóa thành viên"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cài đặt quyền truy cập */}
      {/* <div className="board-access-section">
        <h3>Cài đặt quyền truy cập</h3>
        <div className="access-options">
          <div className="access-option">
            <div className="option-label">
              <h4>Quyền xem dự án</h4>
              <p>Ai có thể xem và tham gia vào dự án này</p>
            </div>
            <select className="access-select">
              <option value="private">Chỉ thành viên</option>
              <option value="organization">Tổ chức</option>
              <option value="public">Công khai</option>
            </select>
          </div>

          <div className="access-option">
            <div className="option-label">
              <h4>Bình luận</h4>
              <p>Cho phép thành viên bình luận trên các thẻ</p>
            </div>
            <div className="toggle-switch-wrapper">
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Bật</span>
            </div>
          </div>

          <div className="access-option">
            <div className="option-label">
              <h4>Thêm thành viên</h4>
              <p>Cho phép thành viên mời người khác tham gia</p>
            </div>
            <div className="toggle-switch-wrapper">
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Tắt</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Modal form thêm thành viên */}
      {showAddMembersForm && (
        <AddMembersForm
          projectId={projectId}
          onClose={() => setShowAddMembersForm(false)}
          onAddMembers={handleAddMembers}
        />
      )}
    </div>
  );
};

export default MemberManagement;