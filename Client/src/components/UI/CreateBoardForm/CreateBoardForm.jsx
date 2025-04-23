// Cập nhật file: src/components/UI/CreateBoardForm/CreateBoardForm.jsx
import React, { useState } from 'react';
import './CreateBoardForm.css';

const CreateBoardForm = ({ onClose, onBoardCreated }) => {
  const [boardData, setBoardData] = useState({
    title: '',
    description: '',
    color: 'purple',
    templateType: 'default'
  });
  
  // State để theo dõi quá trình submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBoardData(prev => ({
      ...prev,
      [name]: value
    }));

    // Xóa thông báo lỗi khi người dùng thay đổi input
    if (error) {
      setError('');
    }
  };
  
  const handleSelectColor = (color) => {
    setBoardData(prev => ({
      ...prev,
      color
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate input
    if (!boardData.title.trim()) {
      setError('Vui lòng nhập tiêu đề bảng');
      setIsSubmitting(false);
      return;
    }
    
    // Log để debug
    console.log('Submitting board data:', boardData);
    
    try {
      // Gọi callback với dữ liệu bảng mới
      if (onBoardCreated) {
        onBoardCreated(boardData);
      }
    } catch (err) {
      console.error('Error creating board:', err);
      setError('Đã xảy ra lỗi khi tạo bảng. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Tạo bảng mới</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Tiêu đề bảng</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Nhập tiêu đề bảng"
                name="title"
                value={boardData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Mô tả</label>
              <textarea 
                className="form-control" 
                rows="3" 
                placeholder="Mô tả ngắn về bảng này"
                name="description"
                value={boardData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label className="form-label">Màu bảng</label>
              <div className="color-options">
                <div 
                  className={`color-option color-purple ${boardData.color === 'purple' ? 'selected' : ''}`}
                  onClick={() => handleSelectColor('purple')}
                ></div>
                <div 
                  className={`color-option color-blue ${boardData.color === 'blue' ? 'selected' : ''}`}
                  onClick={() => handleSelectColor('blue')}
                ></div>
                <div 
                  className={`color-option color-green ${boardData.color === 'green' ? 'selected' : ''}`}
                  onClick={() => handleSelectColor('green')}
                ></div>
                <div 
                  className={`color-option color-orange ${boardData.color === 'orange' ? 'selected' : ''}`}
                  onClick={() => handleSelectColor('orange')}
                ></div>
                <div 
                  className={`color-option color-red ${boardData.color === 'red' ? 'selected' : ''}`}
                  onClick={() => handleSelectColor('red')}
                ></div>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Loại bảng</label>
              <select 
                className="form-control"
                name="templateType"
                value={boardData.templateType}
                onChange={handleChange}
              >
                <option value="default">Bảng trống (mặc định)</option>
                <option value="kanban">Kanban (To Do, In Progress, Done)</option>
                <option value="scrum">Scrum (Backlog, Sprint, Review)</option>
                <option value="project">Quản lý dự án</option>
              </select>
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
              disabled={isSubmitting || !boardData.title.trim()}
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo bảng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardForm;