// 📁 src/components/Layout/Header/MainHeader.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MainHeader.css";
import { useAuth } from "../../../../hooks/useAuth";
import NotificationBellSocket from "../../NotificationBellSocket/NotificationBellSocket";

const MainHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.length === 1 ? parts[0][0] : parts[0][0] + parts[1][0];
  };
// eslint-disable-next-line no-unused-vars
  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <header className="main-header">
      <div className="app-title">
        <h1>Quản lý công việc</h1>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Tìm kiếm..." />
        <button className="search-btn">
          <i className="icon-search" />
        </button>
      </div>

      <div className="header-right">
        <NotificationBellSocket userId={user?.user_id} />
        <div className="user-menu">
          <Link to="/profile" className="user-profile">
            <div className="user-avatar">
              {getInitials(user?.fullName || user?.email)}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
