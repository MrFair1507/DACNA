import React, { useState, useEffect } from "react";
import "./TaskDetailModal.css";
import api from "../../services/api";
import useAssigneeManager from "../../hooks/useAssigneeManager";

const TaskDetailModal = ({ task, projectMembers, onClose, onTaskUpdate, readOnly = false }) => {
  const [editedTask, setEditedTask] = useState({ ...task });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const { assignUserToTask } = useAssigneeManager(task.task_id);

  useEffect(() => {
    setEditedTask({ ...task });
    setIsEditing(false);
    setError("");
  }, [task]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "dueDate" && value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        formattedValue = date.toISOString().split("T")[0];
      }
    }

    setEditedTask((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleAssigneeChange = (e) => {
    const memberId = e.target.value;
    const member = projectMembers.find((m) => m.user_id.toString() === memberId);
    setEditedTask((prev) => ({
      ...prev,
      assignee: member?.full_name || "",
      assigneeId: member?.user_id || "",
      assigneeInitial: member?.full_name?.[0]?.toUpperCase() || "U",
    }));
  };

  const handlePriorityChange = (level) => {
    setEditedTask((prev) => ({ ...prev, priority: level }));
  };

  const handleSave = async () => {
    if (readOnly || !editedTask.title?.trim()) return;

    try {
      const payload = {
        task_title: editedTask.title || task.title,
        task_description: editedTask.description ?? task.description,
        task_status: editedTask.status || task.task_status || "Not Started",
        priority: editedTask.priority || task.priority || "Medium",
        start_date: editedTask.start_date || task.start_date || null,
        due_date: editedTask.dueDate || task.dueDate || null,
      };

      await api.put(`/tasks/${editedTask.task_id}`, payload);

      if (
        editedTask.assigneeId &&
        editedTask.assigneeId !== task.assigneeId
      ) {
        await assignUserToTask(editedTask.assigneeId);
      }

      const assignedMember = projectMembers.find(
        (m) => m.user_id === editedTask.assigneeId
      );

      onTaskUpdate({
        ...task,
        ...editedTask,
        ...payload,
        assignee: assignedMember?.full_name || "Unassigned",
        assigneeInitial: assignedMember?.full_name?.[0]?.toUpperCase() || "U",
      });

      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setError("Lỗi khi cập nhật task");
    }
  };

  const handleDelete = async () => {
    if (readOnly) return;
    try {
      await api.delete(`/tasks/${editedTask.task_id}`);
      onTaskUpdate({ ...editedTask, deleted: true });
      onClose();
    } catch (error) {
      setError("Không thể xoá task");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h3>Chi tiết công việc</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="modal-body">
          {!isEditing ? (
            <>
              <div className="task-detail-title">
                <h2>{task.title || task.content}</h2>
              </div>

              <div className="task-detail-meta">
                <div className="detail-group">
                  <label>Người phụ trách</label>
                  <div className="assignee-info">
                    <div className="assignee-avatar">{task.assigneeInitial}</div>
                    <span>{task.assignee || "Chưa chỉ định"}</span>
                  </div>
                </div>

                <div className="detail-group">
                  <label>Hạn chót</label>
                  <span>{task.dueDate || "Không có"}</span>
                </div>

                <div className="detail-group">
                  <label>Ưu tiên</label>
                  <span className={`priority-badge priority-${(task.priority || "").toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
              </div>

              <div className="task-detail-description">
                <label>Mô tả</label>
                <p>{task.description || "Không có mô tả"}</p>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  value={editedTask.title}
                  onChange={handleInputChange}
                  disabled={readOnly}
                />
              </div>

              <div className="form-group">
                <label>Người phụ trách</label>
                <select
                  value={editedTask.assigneeId || ""}
                  onChange={handleAssigneeChange}
                  disabled={readOnly}
                >
                  <option value="">-- Chọn người phụ trách --</option>
                  {projectMembers.map((member) => (
                    <option key={member.user_id} value={member.user_id}>
                      {member.full_name} ({member.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Hạn chót</label>
                <input
                  type="date"
                  name="dueDate"
                  value={editedTask.dueDate || ""}
                  onChange={handleInputChange}
                  disabled={readOnly}
                />
              </div>

              <div className="form-group">
                <label>Mức độ ưu tiên</label>
                <div className="priority-options">
                  {["High", "Medium", "Low"].map((level) => (
                    <span
                      key={level}
                      className={`priority-badge priority-${level.toLowerCase()} ${
                        editedTask.priority === level ? "selected" : ""
                      }`}
                      onClick={() => !readOnly && handlePriorityChange(level)}
                    >
                      {level === "High" ? "Cao" : level === "Medium" ? "Trung bình" : "Thấp"}
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  name="description"
                  value={editedTask.description}
                  onChange={handleInputChange}
                  rows="4"
                  disabled={readOnly}
                />
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          {isEditing ? (
            <>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Hủy</button>
              <button className="submit-btn" onClick={handleSave} disabled={readOnly}>Lưu</button>
            </>
          ) : (
            <>
              {!readOnly && (
                <>
                  <button className="cancel-btn" onClick={handleDelete}>Xóa</button>
                  <button className="submit-btn" onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
