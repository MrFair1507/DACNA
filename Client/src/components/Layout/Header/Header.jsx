import React from "react";
import { useAuth } from "../../../hooks/useAuth";
import "./Header.css";

const Header = ({
  user,
  activeTab,
  activeProjectId,
  activeSprint,
  onTabSelect,
  onAddMembers,
}) => {
  // eslint-disable-next-line
  const { logout } = useAuth();

  const getProjectName = () => {
    const projects = {
      project1: "Dự án chính",
      project2: "Marketing",
      project3: "Design System",
    };
    return projects[activeProjectId] || "Tất cả dự án";
  };

  // const handleAddMembersClick = () => {
  //   if (onAddMembers) onAddMembers();
  // };

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

        <div className="header-right">
          <div className="notification-btn">
            <i className="icon-notification">thông báo</i>
          </div>
          <div className="user-profile" onClick={logout}>
            <div className="user-avatar">NT</div>
          </div>
        </div>
      </header>

      {/* Hiển thị tabs luôn luôn trên dashboard */}
      <div className="project-header">
        <div className="project-title">
          <h2>
            {getProjectName()}
            {activeSprint && (
              <span className="sprint-title-separator">
                {" "}
                / {activeSprint.name}
              </span>
            )}
          </h2>
        </div>

        <div className="project-tabs">
          <div
            className={`tab ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => onTabSelect(null, "projects")}
          >
            Projects
          </div>
          <div
            className={`tab ${activeTab === "backlog" ? "active" : ""}`}
            onClick={() => onTabSelect(null, "backlog")}
          >
            Backlog
          </div>
          <div
            className={`tab ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => onTabSelect(null, "reports")}
          >
            Reports
          </div>
        </div>

        <div className="project-actions">
          {/* <button className="notification-btn">
            <i className="icon-notification"></i>
            <span>Thông báo</span>
          </button> */}
          {/* <button className="members-btn" onClick={handleAddMembersClick}>
            <i className="icon-members"></i>
            <span>Thành viên</span>
          </button> */}
          {/* <button className="add-task-btn">
            <span className="btn-icon">+</span>
            <span>Thêm công việc</span>
          </button> */}
        </div>
      </div>
    </>
  );
};

export default Header;
