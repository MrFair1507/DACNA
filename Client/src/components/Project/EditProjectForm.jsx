import React, { useState } from "react";
import axios from "axios";
import "./EditProjectForm.css";

const EditProjectForm = ({ project, onClose, onProjectUpdated, onProjectDeleted }) => {
  const [formData, setFormData] = useState({
    project_name: project?.project_name || "",
    project_description: project?.project_description || "",
    project_status: project?.project_status || "Planning",
  });

  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.put(
        `http://localhost:3000/api/projects/${project.project_id}`,
        formData,
        { withCredentials: true }
      );

      if (onProjectUpdated) {
        onProjectUpdated({ ...project, ...formData });
      }

      onClose();
    } catch (err) {
      console.error("❌ Lỗi cập nhật dự án:", err);
      setError("Không thể cập nhật dự án");
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/projects/${project.project_id}`, {
        withCredentials: true,
      });

      console.log("🧨 Xoá dự án:", project.project_id);
      if (onProjectDeleted) {
        onProjectDeleted(project.project_id);
      }

      setShowDeleteConfirm(false);
      onClose();
    } catch (err) {
      console.error("❌ Lỗi xoá dự án:", err);
      alert("Không thể xoá dự án.");
    }
  };

  return (
    <div className="edit-project-form-overlay">
      <div className="edit-project-form">
        <h2>Chỉnh sửa dự án</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên dự án</label>
            <input
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="project_description"
              value={formData.project_description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Trạng thái dự án</label>
            <select
              name="project_status"
              value={formData.project_status}
              onChange={handleChange}
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button type="button" onClick={onClose}>Hủy</button>
            <button type="button" className="delete-btn" onClick={() => setShowDeleteConfirm(true)}>
              Xoá dự án
            </button>
          </div>
        </form>

        {showDeleteConfirm && (
          <div className="modal-overlay">
            <div className="modal-container small">
              <h3>Bạn có chắc chắn muốn xoá dự án này?</h3>
              <p>Thao tác này không thể hoàn tác.</p>
              <div className="modal-footer">
                <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
                  Hủy
                </button>
                <button className="submit-btn" onClick={handleDelete}>
                  Xoá
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProjectForm;
