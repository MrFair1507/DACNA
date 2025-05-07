import React, { useState } from "react";
import AddMembersForm from "../AddMembersForm/AddMembersForm";
import "./CreateProjectForm.css";

const CreateProjectForm = ({ onClose, onProjectCreated, availableUsers }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: "blue",
    templateType: "default",
  });
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showAddMembersPopup, setShowAddMembersPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAddMembers = () => {
    setShowAddMembersPopup(true);
  };

  const handleMembersSelected = (newMembers, method) => {
    if (method === "users") {
      const newUnique = newMembers.filter(
        (u) => !selectedMembers.find((m) => m.id === u.id)
      );
      setSelectedMembers((prev) => [...prev, ...newUnique]);
    }
    setShowAddMembersPopup(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onProjectCreated({ ...formData, members: selectedMembers });
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
            <button
              type="button"
              className="add-members-btn"
              onClick={handleOpenAddMembers}
            >
              + Thêm thành viên
            </button>
            <div className="selected-members-preview">
              {selectedMembers.map((user) => (
                <div key={user.id} className="member-chip">
                  {user.avatar || user.name[0]} – {user.name}
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit">Tạo dự án</button>
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
