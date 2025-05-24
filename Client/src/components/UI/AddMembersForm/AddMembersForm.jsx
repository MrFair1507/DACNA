// Client/src/components/UI/AddMembersForm/AddMembersForm.jsx
import React, { useState, useEffect } from "react";
import "./AddMembersForm.css";
import api from "../../../services/api";

const AddMembersForm = ({ projectId, onClose, onAddMembers }) => {
  const [activeTab, setActiveTab] = useState("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // State cho thêm bằng email
  const [emailInput, setEmailInput] = useState("");
  const [selectedRole, setSelectedRole] = useState(2); // Default role ID
  
  // State cho chọn từ danh sách users
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State cho roles
  const [roles, setRoles] = useState([]);

  // Fetch available users và roles khi component mount
  useEffect(() => {
    fetchAvailableUsers();
    fetchRoles();
  }, []);

  const fetchAvailableUsers = async () => {
    try {
      const response = await api.get("/users", { withCredentials: true });
      setAvailableUsers(response.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get("/roles", { withCredentials: true });
      setRoles(response.data || []);
    } catch (err) {
      console.error("Error fetching roles:", err);
      // Set default roles nếu không fetch được
      setRoles([
        { role_id: 1, role_name: "Project Manager" },
        { role_id: 2, role_name: "Backend Developer" },
        { role_id: 3, role_name: "Frontend Developer" },
      ]);
    }
  };

  // Thêm thành viên bằng email hoặc tên
  const handleAddByEmail = async (e) => {
    e.preventDefault();
    
    if (!emailInput.trim() || !projectId) {
      setError("Vui lòng nhập email hoặc tên người dùng");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post(
        "/dashboard/add-member",
        {
          project_id: projectId,
          email_or_name: emailInput.trim(),
          role_name: roles.find(r => r.role_id === selectedRole)?.role_name || "Backend Developer"
        },
        { withCredentials: true }
      );

      setSuccess(response.data.message || "Đã thêm thành viên thành công!");
      setEmailInput("");
      
      // Callback để parent component biết đã thêm thành viên
      if (onAddMembers) {
        onAddMembers([{
          email: emailInput.trim(),
          role: roles.find(r => r.role_id === selectedRole)?.role_name,
          status: "added"
        }], "email");
      }

      // Tự động đóng form sau 2 giây
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      console.error("Error adding member:", err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Có lỗi xảy ra khi thêm thành viên"
      );
    } finally {
      setLoading(false);
    }
  };

  // Thêm thành viên từ danh sách users có sẵn
  const handleAddSelectedUsers = async () => {
    if (selectedUsers.length === 0) {
      setError("Vui lòng chọn ít nhất một người dùng");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const addedMembers = [];
      
      for (const user of selectedUsers) {
        try {
          const response = await api.post(
            "/dashboard/add-member",
            {
              project_id: projectId,
              email_or_name: user.email,
              role_name: roles.find(r => r.role_id === selectedRole)?.role_name || "Backend Developer"
            },
            { withCredentials: true }
          );
          
          addedMembers.push({
            ...user,
            role: roles.find(r => r.role_id === selectedRole)?.role_name,
            status: "added"
          });
        } catch (err) {
          console.error(`Error adding ${user.email}:`, err);
          addedMembers.push({
            ...user,
            status: "error",
            error: err.response?.data?.message || "Lỗi khi thêm"
          });
        }
      }

      const successCount = addedMembers.filter(m => m.status === "added").length;
      const errorCount = addedMembers.filter(m => m.status === "error").length;

      if (successCount > 0) {
        setSuccess(`Đã thêm thành công ${successCount} thành viên${errorCount > 0 ? `, ${errorCount} lỗi` : ""}`);
      }
      
      if (errorCount > 0 && successCount === 0) {
        setError("Không thể thêm thành viên nào");
      }

      // Callback để parent component biết
      if (onAddMembers) {
        onAddMembers(addedMembers, "users");
      }

      setSelectedUsers([]);

      // Tự động đóng nếu tất cả đều thành công
      if (errorCount === 0) {
        setTimeout(() => {
          onClose();
        }, 2000);
      }

    } catch (err) {
      console.error("Error in bulk add:", err);
      setError("Có lỗi xảy ra khi thêm thành viên");
    } finally {
      setLoading(false);
    }
  };

  // Toggle chọn user
  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.find(u => u.user_id === user.user_id);
      if (isSelected) {
        return prev.filter(u => u.user_id !== user.user_id);
      } else {
        return [...prev, user];
      }
    });
  };

  // Filter users dựa trên search term
  const filteredUsers = availableUsers.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Thêm thành viên vào dự án</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Tab Navigation */}
        <div className="add-method-tabs">
          <button
            className={`method-tab ${activeTab === "email" ? "active" : ""}`}
            onClick={() => setActiveTab("email")}
          >
            Thêm bằng Email/Tên
          </button>
          <button
            className={`method-tab ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Chọn từ danh sách
          </button>
        </div>

        <div className="modal-body">
          {/* Error/Success Messages */}
          {error && (
            <div className="error-message" style={{ marginBottom: "16px", padding: "8px", backgroundColor: "rgba(248, 113, 113, 0.1)", color: "#f87171", borderRadius: "4px" }}>
              {error}
            </div>
          )}
          
          {success && (
            <div className="success-message" style={{ marginBottom: "16px", padding: "8px", backgroundColor: "rgba(74, 222, 128, 0.1)", color: "#4ade80", borderRadius: "4px" }}>
              {success}
            </div>
          )}

          {/* Tab Content */}
          {activeTab === "email" ? (
            <form onSubmit={handleAddByEmail}>
              <div className="form-group">
                <label>Email hoặc Tên người dùng</label>
                <input
                  type="text"
                  placeholder="example@gmail.com hoặc Tên Người Dùng"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Vai trò</label>
                <select 
                  value={selectedRole} 
                  onChange={(e) => setSelectedRole(Number(e.target.value))}
                >
                  {roles.map(role => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.role_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={onClose} className="cancel-btn">
                  Hủy
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Đang thêm..." : "Thêm thành viên"}
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Search Input */}
              <div className="form-group">
                <label>Tìm kiếm người dùng</label>
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Role Selection */}
              <div className="form-group">
                <label>Vai trò cho thành viên được chọn</label>
                <select 
                  value={selectedRole} 
                  onChange={(e) => setSelectedRole(Number(e.target.value))}
                >
                  {roles.map(role => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.role_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Users List */}
              <div className="users-list">
                {filteredUsers.length === 0 ? (
                  <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>
                    Không tìm thấy người dùng nào
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.user_id}
                      className={`user-item ${selectedUsers.find(u => u.user_id === user.user_id) ? "selected" : ""}`}
                      onClick={() => toggleUserSelection(user)}
                    >
                      <div className="user-avatar">
                        {user.full_name ? user.full_name[0].toUpperCase() : "U"}
                      </div>
                      <div className="user-info">
                        <div className="user-name">{user.full_name || "Không có tên"}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                      {selectedUsers.find(u => u.user_id === user.user_id) && (
                        <div className="selected-indicator">✓</div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {selectedUsers.length > 0 && (
                <div className="selected-summary">
                  Đã chọn {selectedUsers.length} người dùng
                </div>
              )}

              <div className="modal-footer">
                <button type="button" onClick={onClose} className="cancel-btn">
                  Hủy
                </button>
                <button 
                  type="button" 
                  onClick={handleAddSelectedUsers} 
                  className="submit-btn" 
                  disabled={loading || selectedUsers.length === 0}
                >
                  {loading ? "Đang thêm..." : `Thêm ${selectedUsers.length} thành viên`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMembersForm;