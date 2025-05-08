import React, { useState } from "react";
import AddMembersForm from "../AddMembersForm/AddMembersForm";
import "./CreateProjectForm.css";
import axios from "axios";

const CreateProjectForm = ({ onClose, onProjectCreated, availableUsers, currentUserId }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: "blue",
    templateType: "default",
  });
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showAddMembersPopup, setShowAddMembersPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAddMembers = () => setShowAddMembersPopup(true);

  const handleMembersSelected = (newMembers, method) => {
    if (method === "users") {
      const newUnique = newMembers.filter(
        (u) => !selectedMembers.find((m) => m.email === u.email)
      );
      setSelectedMembers((prev) => [...prev, ...newUnique]);
    }
    setShowAddMembersPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/projects", {
        project_name: formData.title,
        project_description: formData.description,
        project_status: "In Progress",
        created_by: currentUserId,
      }, { withCredentials: true });

      const newProjectId = response.data.project_id;

      if (selectedMembers.length > 0) {
        const emails = selectedMembers.map((u) => u.email);
        await axios.post("http://localhost:3000/api/invitations/send", {
          projectId: newProjectId,
          emails,
          role: 2,
          message: "Bạn được mời tham gia dự án.",
        }, { withCredentials: true });
      }

      onProjectCreated({
        ...formData,
        id: `project${newProjectId}`,
        members: selectedMembers,
      });

      setLoading(false);
    } catch (err) {
      console.error("Lỗi chi tiết:", err.response?.data || err.message);
      setError("Đã xảy ra lỗi khi tạo dự án hoặc gửi lời mời.");
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
            />
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Màu</label>
            <select name="color" value={formData.color} onChange={handleChange}>
              <option value="blue">Xanh</option>
              <option value="green">Lục</option>
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

          <div className="form-group">
            <label>Thành viên</label>
            <button type="button" className="add-members-btn" onClick={handleOpenAddMembers}>
              + Thêm thành viên
            </button>
            <div className="selected-members-preview">
              {selectedMembers.map((user) => (
                <div key={user.email} className="member-chip">
                  {user.avatar || user.name[0]} – {user.name}
                </div>
              ))}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo dự án"}
            </button>
            <button type="button" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>

        {showAddMembersPopup && (
          <AddMembersForm
            currentMembers={selectedMembers}
            availableUsers={availableUsers}
            onClose={() => setShowAddMembersPopup(false)}
            onAddMembers={handleMembersSelected}
          />
        )}
      </div>
    </div>
  );
};

export default CreateProjectForm;
