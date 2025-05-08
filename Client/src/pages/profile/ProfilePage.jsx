import React from "react";
import Sidebar from "../../components/Layout/Sidebar/Sidebar";
import Header from "../../components/Layout/Header/Header";
import UserProfile from "../../components/Profile/UserProfile";
import { useAuth } from "../../hooks/useAuth";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <Sidebar
        user={user}
        projects={[]} // 👈 truyền mảng rỗng để tránh map lỗi
        activeTab="profile"
        activeProjectId={null}
        onProjectSelect={() => {}}
        onTabSelect={() => {}}
      />

      <div className="main-content">
        <Header user={user} activeView="profile" />

        <div className="content-area">
          <UserProfile />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
