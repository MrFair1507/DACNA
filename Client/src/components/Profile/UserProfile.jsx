// src/pages/profile/UserProfile.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./UserProfile.css";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/me", { withCredentials: true });
        setProfile(response.data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Đang tải thông tin...</div>;
  if (!profile) return <div className="profile-error">Không tìm thấy thông tin người dùng.</div>;
  return (
    <div className="user-profile-page">
      <h2>Thông tin cá nhân</h2>
      <div className="profile-details">
        <p><strong>Họ tên:</strong> {profile.full_name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Vai trò:</strong> {profile.role}</p>
        <p><strong>Số điện thoại:</strong> {profile.phone_number || "Chưa cập nhật"}</p>
        <p><strong>Trạng thái:</strong> {profile.status || "Chưa cập nhật"}</p>
        <p><strong>Xác minh:</strong> {profile.is_verified ? "Đã xác minh" : "Chưa xác minh"}</p>
        <p><strong>Ngày tạo:</strong> {new Date(profile.created_at).toLocaleString()}</p>
        <p><strong>Lần đăng nhập gần nhất:</strong> {new Date(profile.last_login).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default UserProfile;
