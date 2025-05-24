// Client/src/components/UI/CreateProjectForm/CreateProjectForm.jsx
import React, { useState } from "react";
import AddMembersForm from "../AddMembersForm/AddMembersForm";
import "./CreateProjectForm.css";
import api from "../../../services/api";

const CreateProjectForm = ({ onClose, onProjectCreated, currentUserId }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: "blue",
    templateType: "default",
  });
  
  const [showAddMembersPopup, setShowAddMembersPopup] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý khi chọn thành viên (trước khi tạo dự án)
  const handleMembersSelected = (newMembers, method) => {
    console.log("Thành viên được chọn:", newMembers);
    
    // Lưu danh sách thành viên được chọn để thêm sau khi tạo dự án
    const validMembers = newMembers.filter(m => m.status !== "error");
    setSelectedMembers(prev => {
      // Tránh duplicate members
      const existing = prev.map(m => m.email || m.user_id);
      const newUnique = validMembers.filter(m => 
        !existing.includes(m.email || m.user_id)
      );
      return [...prev, ...newUnique];
    });
    
    setShowAddMembersPopup(false);
  };

  // Xóa thành viên khỏi danh sách đã chọn
  const removeMember = (memberToRemove) => {
    setSelectedMembers(prev => 
      prev.filter(m => 
        (m.email || m.user_id) !== (memberToRemove.email || memberToRemove.user_id)
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Bước 1: Tạo dự án
      const response = await api.post(
        "/projects",
        {
          project_name: formData.title,
          project_description: formData.description,
          project_status: "Planning",
          created_by: currentUserId,
        },
        { withCredentials: true }
      );

      const newProjectId = response.data.project_id;

      // Bước 2: Thêm thành viên đã chọn vào dự án (nếu có)
      const addedMembers = [];
      if (selectedMembers.length > 0) {
        for (const member of selectedMembers) {
          try {
            await api.post(
              "/dashboard/add-member",
              {
                project_id: newProjectId,
                email_or_name: member.email || member.full_name,
                role_name: member.role || "Backend Developer"
              },
              { withCredentials: true }
            );
            addedMembers.push({ ...member, status: "added" });
          } catch (memberErr) {
            console.error(`Error adding member ${member.email}:`, memberErr);
            addedMembers.push({ ...member, status: "error" });
          }
        }
      }

      // Bước 3: Thông báo cho parent component
      const projectData = {
        ...formData,
        project_id: newProjectId,
        id: `project${newProjectId}`,
        members: addedMembers,
      };

      onProjectCreated(projectData);
      onClose();

    } catch (err) {
      console.error("Lỗi khi tạo dự án:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Đã xảy ra lỗi khi tạo dự án"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project-form-overlay">
      <div className="create-project-form">
        <h2>Tạo dự án mới</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên dự án</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Nhập tên dự án"
            />
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả về dự án (tùy chọn)"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Màu sắc</label>
            <select name="color" value={formData.color} onChange={handleChange}>
              <option value="blue">Xanh dương</option>
              <option value="green">Xanh lá</option>
              <option value="purple">Tím</option>
              <option value="red">Đỏ</option>
            </select>
          </div>

          <div className="form-group">
            <label>Loại dự án (Template)</label>
            <select
              name="templateType"
              value={formData.templateType}
              onChange={handleChange}
            >
              <option value="default">Mặc định</option>
              <option value="kanban">Kanban</option>
              <option value="scrum">Scrum</option>
              <option value="project">Quản lý dự án</option>
            </select>
          </div>

          {/* Phần thành viên - có thể thêm ngay từ đầu */}
          <div className="form-group">
            <label>Thành viên dự án</label>
            <button 
              type="button" 
              className="add-members-btn" 
              onClick={() => setShowAddMembersPopup(true)}
            >
              + Thêm thành viên
            </button>
            
            {/* Hiển thị danh sách thành viên đã chọn */}
            {selectedMembers.length > 0 && (
              <div className="selected-members-preview">
                <p className="members-count">
                  Đã chọn {selectedMembers.length} thành viên:
                </p>
                {selectedMembers.map((member, index) => (
                  <div key={index} className="member-chip">
                    <span>
                      {member.email || member.full_name} 
                      {member.role && ` - ${member.role}`}
                    </span>
                    <button 
                      type="button"
                      className="remove-member-chip"
                      onClick={() => removeMember(member)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <p className="form-tip">
              Bạn có thể chọn thành viên ngay hoặc thêm sau khi tạo dự án
            </p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo dự án"}
            </button>
          </div>
        </form>

        {/* Modal chọn thành viên */}
        {showAddMembersPopup && (
          <div className="members-selection-modal">
            <div className="members-modal-overlay">
              <div className="members-modal-content">
                <div className="members-modal-header">
                  <h3>Chọn thành viên cho dự án</h3>
                  <button 
                    className="close-members-modal"
                    onClick={() => setShowAddMembersPopup(false)}
                  >
                    ×
                  </button>
                </div>
                
                <MemberSelector 
                  onMembersSelected={handleMembersSelected}
                  selectedMembers={selectedMembers}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Component con để chọn thành viên
const MemberSelector = ({ onMembersSelected, selectedMembers }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users", { withCredentials: true });
      setAvailableUsers(response.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.find(u => u.user_id === user.user_id);
      if (isSelected) {
        return prev.filter(u => u.user_id !== user.user_id);
      } else {
        return [...prev, { ...user, role: "Backend Developer" }];
      }
    });
  };

  const handleConfirm = () => {
    onMembersSelected(selectedUsers.map(u => ({ ...u, status: "selected" })), "users");
  };

  const filteredUsers = availableUsers.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lọc ra những user đã được chọn trước đó
  const alreadySelectedIds = selectedMembers.map(m => m.user_id || m.email);
  const availableForSelection = filteredUsers.filter(user =>
    !alreadySelectedIds.includes(user.user_id) && !alreadySelectedIds.includes(user.email)
  );

  if (loading) {
    return <div className="loading">Đang tải danh sách người dùng...</div>;
  }

  return (
    <div className="member-selector">
      <div className="search-section">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="users-grid">
        {availableForSelection.length === 0 ? (
          <p className="no-users">Không có người dùng nào để chọn</p>
        ) : (
          availableForSelection.map(user => (
            <div
              key={user.user_id}
              className={`user-card ${selectedUsers.find(u => u.user_id === user.user_id) ? 'selected' : ''}`}
              onClick={() => toggleUserSelection(user)}
            >
              <div className="user-avatar">
                {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
              </div>
              <div className="user-info">
                <div className="user-name">{user.full_name || 'Không có tên'}</div>
                <div className="user-email">{user.email}</div>
              </div>
              {selectedUsers.find(u => u.user_id === user.user_id) && (
                <div className="selected-check">✓</div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="member-selector-footer">
        <p>Đã chọn: {selectedUsers.length} người</p>
        <button 
          className="confirm-selection-btn"
          onClick={handleConfirm}
          disabled={selectedUsers.length === 0}
        >
          Xác nhận chọn
        </button>
      </div>
    </div>
  );
};

export default CreateProjectForm;