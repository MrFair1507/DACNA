import React from "react";
import "./Sidebar.css";

const Sidebar = ({
  projects = [],
  activeTab,
  activeProjectId,
  onProjectSelect,
  onTabSelect,
  showMemberMenu = false,
  onInviteClick,
  onManageClick,
}) => {
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
            className={!activeProjectId ? "active" : ""}
            onClick={() => {
              if (onTabSelect) onTabSelect(null, "project");
              if (onProjectSelect) onProjectSelect(null);
            }}
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
          {projects.map((project) => (
            <li
              key={project.id}
              className={activeProjectId === project.id ? "active" : ""}
              onClick={() => onProjectSelect(project.id)}
            >
              <div
                className={`board-color color-${project.color || "blue"}`}
              ></div>
              <span>{project.title}</span>
            </li>
          ))}
        </ul>
      </div>
      {showMemberMenu && ( 
        <div className="sidebar-section">
          <h4>THÀNH VIÊN</h4>
          <ul className="sidebar-menu">
            <li onClick={onManageClick}>
              <span className="menu-icon">
                <i className="icon-members"></i>
              </span>
              <span>Quản lý thành viên</span>
            </li>
            <li onClick={onInviteClick}>
              <span className="menu-icon">
                <i className="icon-invite"></i>
              </span>
              <span>Mời thành viên</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
