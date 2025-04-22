import React, { useState } from 'react';
import './TaskDetailModal.css';

const TaskDetailModal = ({ task, boardMembers, onClose, onTaskUpdate }) => {
    const [editMode, setEditMode] = useState(false);
    const [taskData, setTaskData] = useState({
      ...task
    });
    const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  
    const getPriorityClass = (priority) => {
      switch(priority) {
        case 'high':
          return 'priority-high';
        case 'medium':
          return 'priority-medium';
        case 'low':
          return 'priority-low';
        default:
          return '';
      }
    };
  
    const getPriorityText = (priority) => {
      switch(priority) {
        case 'high':
          return 'Cao';
        case 'medium':
          return 'Trung bình';
        case 'low':
          return 'Thấp';
        default:
          return '';
      }
    };
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setTaskData({
        ...taskData,
        [name]: value
      });
    };
  
    const handlePriorityChange = (priority) => {
      setTaskData({
        ...taskData,
        priority
      });
    };
  
    const handleAssigneeSelect = (member) => {
      setTaskData({
        ...taskData,
        assignee: member.name,
        assigneeId: member.id,
        assigneeInitial: member.avatar
      });
      setShowAssigneeDropdown(false);
    };
  
    const handleSave = () => {
      onTaskUpdate(taskData);
    };
  
    const handleDelete = () => {
      // Trong thực tế sẽ xác nhận trước khi xóa
      onTaskUpdate({ ...taskData, deleted: true });
    };
  
    return (
      <div className="modal-overlay">
        <div className="modal-container task-detail-modal">
          <div className="modal-header">
            <h3>Chi tiết công việc</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <div className="modal-body">
            {editMode ? (
              // Chế độ chỉnh sửa
              <>
                <div className="form-group">
                  <label className="form-label">Tiêu đề</label>
                  <input 
                    type="text" 
                    className="form-control"
                    name="content"
                    value={taskData.content}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Mô tả</label>
                  <textarea 
                    className="form-control"
                    rows="3"
                    name="description"
                    value={taskData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
                
                <div className="form-row">
                  <div className="form-group half">
                    <label className="form-label">Người phụ trách</label>
                    <div className="assignee-selector">
                      <div 
                        className="form-control assignee-display"
                        onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                      >
                        {taskData.assignee || 'Chọn người phụ trách'}
                      </div>
                      
                      {showAssigneeDropdown && (
                        <div className="assignee-dropdown">
                          {boardMembers.map(member => (
                            <div 
                              key={member.id}
                              className="assignee-option"
                              onClick={() => handleAssigneeSelect(member)}
                            >
                              <div className="option-avatar">
                                <span>{member.avatar}</span>
                              </div>
                              <div className="option-name">{member.name}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-group half">
                    <label className="form-label">Ngày hết hạn</label>
                    <input 
                      type="text" 
                      className="form-control"
                      name="dueDate"
                      value={taskData.dueDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Mức độ ưu tiên</label>
                  <div className="priority-options">
                    <div 
                      className={`priority-option ${taskData.priority === 'high' ? 'selected' : ''}`}
                      onClick={() => handlePriorityChange('high')}
                    >
                      <span className="priority-badge priority-high">Cao</span>
                    </div>
                    <div 
                      className={`priority-option ${taskData.priority === 'medium' ? 'selected' : ''}`}
                      onClick={() => handlePriorityChange('medium')}
                    >
                      <span className="priority-badge priority-medium">Trung bình</span>
                    </div>
                    <div 
                      className={`priority-option ${taskData.priority === 'low' ? 'selected' : ''}`}
                      onClick={() => handlePriorityChange('low')}
                    >
                      <span className="priority-badge priority-low">Thấp</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Chế độ xem
              <>
                <div className="task-detail-title">
                  <h2>{task.content}</h2>
                </div>
                
                <div className="task-detail-meta">
                  <div className="detail-group">
                    <label>Người phụ trách</label>
                    <div className="assignee-info">
                      <div className="assignee-avatar">
                        <span>{task.assigneeInitial}</span>
                      </div>
                      <span>{task.assignee}</span>
                    </div>
                  </div>
                  
                  <div className="detail-group">
                    <label>Mức độ ưu tiên</label>
                    <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                      {getPriorityText(task.priority)}
                    </span>
                  </div>
                  
                  <div className="detail-group">
                    <label>Ngày hết hạn</label>
                    <span className="due-date">{task.dueDate}</span>
                  </div>
                </div>
                
                <div className="task-detail-description">
                  <label>Mô tả</label>
                  <p>{task.description || 'Chưa có mô tả chi tiết.'}</p>
                </div>
                
                <div className="task-detail-actions">
                  <button className="action-btn add-comment-btn">
                    <i className="icon-comment">💬</i>
                    <span>Thêm bình luận</span>
                  </button>
                  
                  <button className="action-btn add-checklist-btn">
                    <i className="icon-checklist">✓</i>
                    <span>Thêm checklist</span>
                  </button>
  
                  <button 
                    className="action-btn assign-user-btn"
                    onClick={() => {
                      setEditMode(true);
                      setShowAssigneeDropdown(true);
                    }}
                  >
                    <i className="icon-user">👤</i>
                    <span>Gán người phụ trách</span>
                  </button>
                </div>
                
                <div className="task-detail-activity">
                  <label>Hoạt động</label>
                  <div className="activity-empty">
                    <p>Chưa có hoạt động nào.</p>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="modal-footer">
            {editMode ? (
              <>
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setTaskData({...task});
                    setEditMode(false);
                  }}
                >
                  Hủy
                </button>
                <button 
                  className="save-btn"
                  onClick={handleSave}
                >
                  Lưu thay đổi
                </button>
              </>
            ) : (
              <>
                <button 
                  className="delete-btn"
                  onClick={handleDelete}
                >
                  <i className="icon-delete">🗑️</i>
                  <span>Xóa thẻ</span>
                </button>
                <button 
                  className="edit-btn"
                  onClick={() => setEditMode(true)}
                >
                  <i className="icon-edit">✏️</i>
                  <span>Chỉnh sửa</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

export default TaskDetailModal;