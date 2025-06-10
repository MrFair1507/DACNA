import React, { useState } from "react";
import axios from "axios";
import "./DeleteProjectModal.css";

const DeleteProjectModal = ({ projectId, onClose, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.delete(`http://localhost:3000/api/projects/${projectId}`, {
        withCredentials: true,
      });
      if (onDeleted) onDeleted(projectId);
      onClose();
    } catch (err) {
      console.error("❌ Lỗi xoá dự án:", err);
      setError("Không thể xoá dự án.");
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container small">
        <h3>Bạn có chắc chắn muốn xoá dự án?</h3>
        <p>Thao tác này sẽ xoá vĩnh viễn dự án và không thể hoàn tác.</p>

        {error && <div className="error-message">{error}</div>}

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Hủy
          </button>
          <button className="submit-btn" onClick={handleDelete} disabled={loading}>
            {loading ? "Đang xoá..." : "Xoá"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProjectModal;
