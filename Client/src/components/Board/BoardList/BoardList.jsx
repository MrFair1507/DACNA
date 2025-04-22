import React from 'react';
import './BoardList.css';

const BoardList = ({ onBoardSelect, onCreateBoard }) => {
  // Sample data for boards
  const boards = [
    { 
      id: 'board1', 
      title: 'Dự án chính',
      color: 'purple',
      description: 'Phát triển ứng dụng quản lý công việc',
      owner: 'Team Dev',
      members: 8,
      lastModified: '21/04/2025'
    },
    { 
      id: 'board2', 
      title: 'Marketing',
      color: 'green',
      description: 'Chiến dịch quảng cáo Q2 2025',
      owner: 'Marketing Team',
      members: 5,
      lastModified: '19/04/2025'
    },
    { 
      id: 'board3', 
      title: 'Design System',
      color: 'blue',
      description: 'UI/UX components và guidelines',
      owner: 'Design Team',
      members: 3,
      lastModified: '18/04/2025'
    }
  ];

  return (
    <div className="board-list-container">
      <div className="board-list-header">
        <h2>Bảng của tôi</h2>
        <button 
          className="create-board-btn"
          onClick={onCreateBoard}
        >
          <span className="btn-icon">+</span>
          <span>Tạo bảng mới</span>
        </button>
      </div>

      <div className="boards-grid">
        {boards.map(board => (
          <div 
            key={board.id} 
            className="board-card" 
            onClick={() => onBoardSelect(board.id)}
          >
            <div className={`board-color color-${board.color}`}></div>
            <h3 className="board-title">{board.title}</h3>
            <p className="board-description">{board.description}</p>
            <div className="board-meta">
              <div className="board-owner">
                <span className="label">Chủ sở hữu:</span>
                <span>{board.owner}</span>
              </div>
              <div className="board-stats">
                <div className="members-count">
                  <i className="icon-members"></i>
                  <span>{board.members}</span>
                </div>
                <div className="last-modified">
                  <span>Cập nhật: {board.lastModified}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div 
          className="board-card create-new-board" 
          onClick={onCreateBoard}
        >
          <div className="create-icon">+</div>
          <h3>Tạo bảng mới</h3>
        </div>
      </div>
    </div>
  );
};

export default BoardList;