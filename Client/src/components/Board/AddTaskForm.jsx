import React, { useState } from 'react';
import './AddTaskForm.css';

const AddTaskForm = ({ boardMembers, onClose, onSubmit }) => {
    const [taskData, setTaskData] = useState({
      title: '',
      assignee: '',
      assigneeId: null,
      dueDate: '',
      priority: 'medium',
      description: ''
    });
  
    const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setTaskData(prev => ({
        ...prev,
        [name]: value
      }));
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
        assigneeId: member.id
      });
      setShowAssigneeDropdown(false);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(taskData);
    };
  
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h3>Thêm thẻ mới</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Tiêu đề thẻ</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Nhập tiêu đề thẻ"
                  name="title"
                  value={taskData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
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
              
              <div className="form-row">
                <div className="form-group half">
                  <label className="form-label">Ngày hết hạn</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="VD: 25/04/2025"
                    name="dueDate"
                    value={taskData.dueDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group half">
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
              </div>
              
              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Nhập mô tả chi tiết cho thẻ"
                  name="description"
                  value={taskData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button"
                className="cancel-btn"
                onClick={onClose}
              >
                Hủy
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={!taskData.title.trim() || !taskData.dueDate.trim()}
              >
                Thêm thẻ
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default AddTaskForm;