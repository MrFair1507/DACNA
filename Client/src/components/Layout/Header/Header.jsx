import React from "react";
import { useAuth } from "../../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ activeTab, activeProjectId, activeSprint, onTabSelect }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getProjectName = () => {
    const projects = {
      project1: "Dự án chính",
      project2: "Marketing",
      project3: "Design System",
    };
    return projects[activeProjectId] || "Tất cả dự án";
  };
  // eslint-disable-next-line
  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0];
    return words[0][0] + words[1][0];
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

        <div className="header-right">
          <div className="notification-btn">
            <i className="icon-notification">🔔</i>
          </div>

          <div className="user-menu">
            <Link to="/profile" className="user-profile">
              <div className="user-avatar">
                {getInitials(user?.fullName || user?.email)}
              </div>
            </Link>
            {/* <button className="logout-btn" onClick={handleLogout}>
              Đăng xuất
            </button> */}
          </div>
        </div>
      </header>

      <div className="project-header">
        <div className="project-title-header">
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
      </div>
    </>
  );
};

export default Header;
