import React from 'react';
import './Sidebar.css';

const Sidebar = ({ projects = [], activeTab, activeProjectId, onProjectSelect, onTabSelect }) => {
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
            className={!activeProjectId ? 'active' : ''}
            onClick={() => onProjectSelect(null)}
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
        <h4>DỰ ÁN CỦA TÔI</h4>
        <ul className="sidebar-menu">
          {projects.map(project => (
            <li 
              key={project.id}
              className={activeProjectId === project.id ? 'active' : ''}
              onClick={() => onProjectSelect(project.id)}
            >
              <div className={`board-color color-${project.color || "blue"}`}></div>
              <span>{project.title}</span>
            </li>
          ))}
        </ul>
      </div>

      {activeProjectId && (
        <>
          <div className="sidebar-section">
            <h4>DỰ ÁN HIỆN TẠI</h4>
            <ul className="sidebar-menu">
              <li 
                className={activeTab === 'board' ? 'active' : ''}
                onClick={() => onTabSelect(activeProjectId, 'board')}
              >
                <span className="menu-icon"><i className="icon-board"></i></span>
                <span>Board</span>
              </li>
              <li 
                className={activeTab === 'sprints' ? 'active' : ''}
                onClick={() => onTabSelect(activeProjectId, 'sprints')}
              >
                <span className="menu-icon"><i className="icon-sprint"></i></span>
                <span>Sprints</span>
              </li>
              <li 
                className={activeTab === 'backlog' ? 'active' : ''}
                onClick={() => onTabSelect(activeProjectId, 'backlog')}
              >
                <span className="menu-icon"><i className="icon-backlog"></i></span>
                <span>Backlog</span>
              </li>
              <li 
                className={activeTab === 'reports' ? 'active' : ''}
                onClick={() => onTabSelect(activeProjectId, 'reports')}
              >
                <span className="menu-icon"><i className="icon-reports"></i></span>
                <span>Báo cáo</span>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h4>THÀNH VIÊN</h4>
            <ul className="sidebar-menu">
              <li>
                <span className="menu-icon"><i className="icon-members"></i></span>
                <span>Quản lý thành viên</span>
              </li>
              <li>
                <span className="menu-icon"><i className="icon-invite"></i></span>
                <span>Mời thành viên</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
