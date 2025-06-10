import React, { useState } from "react";
import axios from "axios";
import AddMembersForm from "../AddMembersForm/AddMembersForm";
import "./CreateProjectForm.css";

const CreateProjectForm = ({ onClose, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
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

  const handleMembersSelected = (newMembers) => {
    const unique = newMembers.filter(
      (u) => !selectedMembers.find((m) => m.email === u.email)
    );
    setSelectedMembers((prev) => [...prev, ...unique]);
    setShowAddMembersPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/projects",
        {
          project_name: formData.title,
          project_description: formData.description,
          template_type: formData.templateType,
          members: selectedMembers.map((m) => ({
            email: m.email,
            role_id: m.role_id || 2,
          })),
        },
        { withCredentials: true }
      );

      const newProjectId = response.data.project_id;

      onProjectCreated({
        ...formData,
        project_id: newProjectId,
        members: selectedMembers,
      });

      setLoading(false);
      onClose();
    } catch (err) {
      console.error("❌ Lỗi tạo dự án:", err.response?.data || err.message);
      setError("Không thể tạo dự án hoặc mời thành viên.");
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
            />
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
            <button
              type="button"
              className="add-members-btn"
              onClick={() => setShowAddMembersPopup(true)}
            >
              + Thêm thành viên
            </button>
            <div className="selected-members-preview">
              {selectedMembers.map((user) => (
                <div key={user.email} className="member-chip">
                  {user.email} ({user.role_id})
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
            onClose={() => setShowAddMembersPopup(false)}
            onAddMembers={handleMembersSelected}
          />
        )}
      </div>
    </div>
  );
};

export default CreateProjectForm;
