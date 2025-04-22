import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeTab, activeBoardId, onBoardSelect, onTabSelect, onCreateBoard }) => {
  // Board data
  const boards = [
    { id: 'board1', name: 'Dự án chính', color: 'purple' },
    { id: 'board2', name: 'Marketing', color: 'green' },
    { id: 'board3', name: 'Design System', color: 'blue' }
  ];
  
  return (
    <div className="sidebar">
      <div className="workspace-info">
        <div className="workspace-avatar">KM</div>
        <div className="workspace-details">
          <h3>Kanban Master</h3>
          <span className="workspace-type">Workspace</span>
        </div>
      </div>
      
      <div className="sidebar-section">
        <h4>TỔNG QUAN</h4>
        <ul className="sidebar-menu">
          <li 
            className={!activeBoardId ? 'active' : ''}
            onClick={() => onBoardSelect(null)}
          >
            <span className="menu-icon">
              <i className="icon-dashboard"></i>
            </span>
            <span>Dashboard</span>
          </li>
          <li>
            <span className="menu-icon">
              <i className="icon-profile"></i>
            </span>
            <span>Hồ sơ</span>
          </li>
          <li>
            <span className="menu-icon">
              <i className="icon-settings"></i>
            </span>
            <span>Cài đặt</span>
          </li>
        </ul>
      </div>
      
      <div className="sidebar-section">
        <h4>BẢNG CỦA TÔI</h4>
        <ul className="sidebar-menu">
          {boards.map(board => (
            <li 
              key={board.id}
              className={activeBoardId === board.id ? 'active' : ''}
              onClick={() => onBoardSelect(board.id)}
            >
              <div className={`board-color color-${board.color}`}></div>
              <span>{board.name}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Only show these sections when in a board view */}
      {activeBoardId && (
        <>
          <div className="sidebar-section">
            <h4>DỰ ÁN HIỆN TẠI</h4>
            <ul className="sidebar-menu">
              <li 
                className={activeTab === 'board' ? 'active' : ''}
                onClick={() => onTabSelect(activeBoardId, 'board')}
              >
                <span className="menu-icon">
                  <i className="icon-board"></i>
                </span>
                <span>Board</span>
              </li>
              <li 
                className={activeTab === 'sprints' ? 'active' : ''}
                onClick={() => onTabSelect(activeBoardId, 'sprints')}
              >
                <span className="menu-icon">
                  <i className="icon-sprint"></i>
                </span>
                <span>Sprints</span>
              </li>
              <li 
                className={activeTab === 'backlog' ? 'active' : ''}
                onClick={() => onTabSelect(activeBoardId, 'backlog')}
              >
                <span className="menu-icon">
                  <i className="icon-backlog"></i>
                </span>
                <span>Backlog</span>
              </li>
              <li 
                className={activeTab === 'reports' ? 'active' : ''}
                onClick={() => onTabSelect(activeBoardId, 'reports')}
              >
                <span className="menu-icon">
                  <i className="icon-reports"></i>
                </span>
                <span>Reports</span>
              </li>
            </ul>
          </div>
          
          <div className="sidebar-section">
            <h4>THÀNH VIÊN</h4>
            <ul className="sidebar-menu">
              <li>
                <span className="menu-icon">
                  <i className="icon-members"></i>
                </span>
                <span>Quản lý thành viên</span>
              </li>
              <li>
                <span className="menu-icon">
                  <i className="icon-invite"></i>
                </span>
                <span>Mời thành viên</span>
              </li>
            </ul>
          </div>
        </>
      )}
      
      <div className="sidebar-footer">
        <button 
          className="create-board-btn"
          onClick={onCreateBoard}
        >
          <span className="btn-icon">+</span>
          <span>Tạo bảng mới</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;