import React, { useState, useEffect } from 'react';
import './TaskDetailModal.css';
import api from '../../services/api';

const TaskDetailModal = ({ task, projectMembers, onClose, onTaskUpdate }) => {
  const [editedTask, setEditedTask] = useState({ ...task });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setEditedTask({ ...task });
    setIsEditing(false);
    setError('');
  }, [task]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssigneeChange = (e) => {
    const memberId = e.target.value;
    const member = projectMembers.find((m) => m.user_id.toString() === memberId);
    setEditedTask((prev) => ({
      ...prev,
      assignee: member?.full_name || '',
      assigneeId: member?.user_id || '',
      assigneeInitial: member?.full_name?.[0]?.toUpperCase() || 'U',
    }));
  };

  const handlePriorityChange = (level) => {
    setEditedTask((prev) => ({ ...prev, priority: level }));
  };

  const handleSave = async () => {
    if (!editedTask.title?.trim()) {
      setError('Tiêu đề không được để trống');
      return;
    }

    try {
      await api.put(`/tasks/${editedTask.task_id}`, {
        task_title: editedTask.title,
        task_description: editedTask.description,
        task_status: editedTask.status,
        priority: editedTask.priority,
        start_date: editedTask.start_date || null,
        due_date: editedTask.dueDate,
        assigned_user_id: editedTask.assigneeId || null
      });

      onTaskUpdate(editedTask);
      setIsEditing(false);
    } catch (error) {
      setError('Lỗi khi cập nhật task');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${editedTask.task_id}`);
      onTaskUpdate({ ...editedTask, deleted: true });
      onClose();
    } catch (error) {
      setError('Không thể xoá task');
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
                    <span>{task.assignee || 'Chưa chỉ định'}</span>
                  </div>
                </div>

                <div className="detail-group">
                  <label>Hạn chót</label>
                  <span>{task.dueDate || 'Không có'}</span>
                </div>

                <div className="detail-group">
                  <label>Ưu tiên</label>
                  <span className={`priority-badge priority-${(task.priority || '').toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
              </div>

              <div className="task-detail-description">
                <label>Mô tả</label>
                <p>{task.description || 'Không có mô tả'}</p>
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
                />
              </div>

              <div className="form-group">
                <label>Người phụ trách</label>
                <select value={editedTask.assigneeId || ''} onChange={handleAssigneeChange}>
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
                  value={editedTask.dueDate || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Mức độ ưu tiên</label>
                <div className="priority-options">
                  {['High', 'Medium', 'Low'].map((level) => (
                    <span
                      key={level}
                      className={`priority-badge priority-${level.toLowerCase()} ${editedTask.priority === level ? 'selected' : ''}`}
                      onClick={() => handlePriorityChange(level)}
                    >
                      {level === 'High' ? 'Cao' : level === 'Medium' ? 'Trung bình' : 'Thấp'}
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
                />
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          {isEditing ? (
            <>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Hủy</button>
              <button className="submit-btn" onClick={handleSave}>Lưu</button>
            </>
          ) : (
            <>
              <button className="cancel-btn" onClick={handleDelete}>Xóa</button>
              <button className="submit-btn" onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
