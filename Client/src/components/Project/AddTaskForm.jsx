import React, { useState } from "react";
import api from "../../services/api";
import "./AddTaskForm.css";

const AddTaskForm = ({ sprintBacklogId, onTaskCreated, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assigneeId, setAssigneeId] = useState(null);
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Vui lòng nhập tiêu đề task.");
      return;
    }

    try {
      const res = await api.post("/tasks", {
        sprint_backlog_id: sprintBacklogId,
        task_title: title,
        task_description: description,
        priority,
        assigned_user_id: assigneeId,
        due_date: dueDate,
        task_status: "Not Started", // ✅ khởi tạo đúng cột "Chưa phân loại"
      });

      if (onTaskCreated) onTaskCreated(res.data);
      if (onClose) onClose();
    } catch (err) {
      console.error("❌ Lỗi khi tạo task:", err);
      alert("Không thể tạo task. Vui lòng thử lại.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Tạo Task Mới</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tiêu đề</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề task"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả chi tiết"
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label className="form-label">Độ ưu tiên</label>
              <select
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            </div>

            <div className="form-group half">
              <label className="form-label">Hạn chót</label>
              <input
                type="date"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Người thực hiện (ID)</label>
            <input
              type="number"
              className="form-control"
              value={assigneeId || ""}
              onChange={(e) => setAssigneeId(Number(e.target.value))}
              placeholder="ID người dùng (nếu có)"
            />
          </div>
        </form>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose} type="button">Hủy</button>
          <button className="submit-btn" onClick={handleSubmit}>Tạo</button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskForm;
