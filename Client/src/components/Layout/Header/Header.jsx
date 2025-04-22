import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import './Header.css';

const Header = ({ user, activeView, activeTab, activeBoardId, onTabSelect, onAddMembers }) => {
  const { logout } = useAuth();
  
  // Determine if we're in a board view
  const isInBoardView = activeBoardId !== null;
  
  // Get the current board name
  const getBoardName = () => {
    // Tạm thời hardcode cho demo
    const boards = {
      'board1': 'Dự án chính',
      'board2': 'Marketing',
      'board3': 'Design System'
    };
    
    return boards[activeBoardId] || 'Dự án hiện tại';
  };

  // Xử lý thêm thành viên 
  const handleAddMembersClick = () => {
    if (onAddMembers) {
      onAddMembers();
    }
  };

  return (
    <>
      <header className="main-header">
        <div className="app-title">
          <h1>Quản lý công việc</h1>
        </div>
        
        <div className="search-bar">
          <input type="text" placeholder="Tìm kiếm..." />
          <button className="search-btn">
            <i className="icon-search"></i>
          </button>
        </div>
        
        <div className="user-profile" onClick={logout}>
          <div className="notification-icon">
            <i className="icon-notification"></i>
          </div>
          <div className="user-avatar">
            <span>{user?.firstName?.[0] || 'N'}{user?.lastName?.[0] || 'T'}</span>
          </div>
        </div>
      </header>
      
      {/* Project Header - Only show when in a board view */}
      {isInBoardView && (
        <div className="project-header">
          <div className="project-title">
            <h2>{getBoardName()}</h2>
          </div>
          
          <div className="project-tabs">
            <div 
              className={`tab ${activeTab === 'board' ? 'active' : ''}`} 
              onClick={() => onTabSelect(activeBoardId, 'board')}
            >
              Board
            </div>
            <div 
              className={`tab ${activeTab === 'backlog' ? 'active' : ''}`} 
              onClick={() => onTabSelect(activeBoardId, 'backlog')}
            >
              Backlog
            </div>
            <div 
              className={`tab ${activeTab === 'sprints' ? 'active' : ''}`} 
              onClick={() => onTabSelect(activeBoardId, 'sprints')}
            >
              Sprints
            </div>
            <div 
              className={`tab ${activeTab === 'reports' ? 'active' : ''}`} 
              onClick={() => onTabSelect(activeBoardId, 'reports')}
            >
              Reports
            </div>
          </div>
          
          <div className="project-actions">
            <button className="notification-btn">
              <i className="icon-notification"></i>
              <span>Thông báo</span>
            </button>
            <button 
              className="members-btn"
              onClick={handleAddMembersClick}
            >
              <i className="icon-members"></i>
              <span>Thành viên</span>
            </button>
            <button className="add-task-btn">
              <span className="btn-icon">+</span>
              <span>Thêm công việc</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;