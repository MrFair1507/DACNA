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
    setEditedTask((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAssigneeChange = (e) => {
    const memberId = e.target.value;
    const member = projectMembers.find(m => m.id === memberId);
    setEditedTask((prev) => ({
      ...prev,
      assignee: member?.name || '',
      assigneeId: member?.id || '',
      assigneeInitial: member?.name ? member.name[0] : ''
    }));
  };

  const handlePriorityChange = (level) => {
    setEditedTask((prev) => ({
      ...prev,
      priority: level
    }));
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
      due_date: editedTask.dueDate
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
              <h4>{task.title || task.content}</h4>
              <p><strong>Người phụ trách:</strong> {task.assignee || 'Chưa chỉ định'}</p>
              <p><strong>Hạn chót:</strong> {task.dueDate}</p>
              <p><strong>Mức độ ưu tiên:</strong> {task.priority}</p>
              <p><strong>Mô tả:</strong></p>
              <p>{task.description || 'Không có mô tả'}</p>
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
                  {projectMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Hạn chót</label>
                <input
                  type="text"
                  name="dueDate"
                  value={editedTask.dueDate}
                  onChange={handleInputChange}
                  placeholder="VD: 25/04/2025"
                />
              </div>

              <div className="form-group">
                <label>Mức độ ưu tiên</label>
                <div className="priority-options">
                  {['high', 'medium', 'low'].map(level => (
                    <span
                      key={level}
                      className={`priority-badge priority-${level} ${editedTask.priority === level ? 'selected' : ''}`}
                      onClick={() => handlePriorityChange(level)}
                    >
                      {level === 'high' ? 'Cao' : level === 'medium' ? 'Trung bình' : 'Thấp'}
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

