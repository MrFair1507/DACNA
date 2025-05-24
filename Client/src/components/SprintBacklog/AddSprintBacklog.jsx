import React, { useState } from "react";
import "./AddSprintBacklog.css";

const AddSprintBacklog = ({ sprintId, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!title) return;
    onSubmit({ sprintId, title, description });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Thêm Sprint Backlog</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            placeholder="Tiêu đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Hủy</button>
          <button className="submit-btn" onClick={handleSubmit} disabled={!title}>Tạo</button>
        </div>
      </div>
    </div>
  );
};

export default AddSprintBacklog;
