
import React, { useState } from 'react';
import './CreateSprintForm.css';

const CreateSprintForm = ({ onClose, onSubmit, currentBoard }) => {
  const [sprintData, setSprintData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    color: 'purple', // Default color
    boardId: currentBoard?.id || null
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSprintData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectColor = (color) => {
    setSprintData(prev => ({
      ...prev,
      color
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!sprintData.name || !sprintData.startDate || !sprintData.endDate) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    
    // Call the onSubmit callback
    onSubmit(sprintData);
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Tạo Sprint mới</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Tiêu đề Sprint</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Nhập tiêu đề sprint"
                name="name"
                value={sprintData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Mô tả</label>
              <textarea 
                className="form-control" 
                rows="3" 
                placeholder="Mô tả ngắn về sprint này"
                name="description"
                value={sprintData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="form-row">
              <div className="form-group half">
                <label className="form-label">Ngày bắt đầu</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="VD: 01/05/2025"
                  name="startDate"
                  value={sprintData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group half">
                <label className="form-label">Ngày kết thúc</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="VD: 15/05/2025"
                  name="endDate"
                  value={sprintData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Màu Sprint</label>
              <div className="color-options">
                <div 
                  className={`color-option color-purple ${sprintData.color === 'purple' ? 'selected' : ''}`}
                  onClick={() => handleSelectColor('purple')}
                ></div>
                <div 
                  className={`color-option color-blue ${sprintData.color === 'blue' ? 'selected' : ''}`}
                  onClick={() => handleSelectColor('blue')}
                ></div>
                <div 
                  className={`color-option color-green ${sprintData.color === 'green' ? 'selected' : ''}`}
                  onClick={() => handleSelectColor('green')}
                ></div>
                <div 
                  className={`color-option color-orange ${sprintData.color === 'orange' ? 'selected' : ''}`}
                  onClick={() => handleSelectColor('orange')}
                ></div>
                <div 
                  className={`color-option color-red ${sprintData.color === 'red' ? 'selected' : ''}`}
                  onClick={() => handleSelectColor('red')}
                ></div>
              </div>
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
              disabled={!sprintData.name.trim() || !sprintData.startDate || !sprintData.endDate}
            >
              Tạo Sprint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSprintForm;