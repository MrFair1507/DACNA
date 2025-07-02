// src/pages/profile/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import "./UserProfile.css";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const { logout } = useAuth();
  const navigate = useNavigate();

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

  const handleEdit = () => {
    setEditForm({
      full_name: profile.full_name,
      phone_number: profile.phone_number || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Gọi API để cập nhật thông tin
      const response = await api.put("/auth/profile", editForm, { withCredentials: true });
      setProfile(prev => ({
        ...prev,
        full_name: editForm.full_name,
        phone_number: editForm.phone_number
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin!");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-error">
        <div className="error-icon">⚠️</div>
        <p>Không tìm thấy thông tin người dùng.</p>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <h1>Thông tin cá nhân</h1>
          <p>Quản lý thông tin tài khoản của bạn</p>
        </div>
        <button
          onClick={isEditing ? handleCancel : handleEdit}
          className={`edit-btn ${isEditing ? 'cancel' : 'edit'}`}
        >
          <span className="btn-icon">
            {isEditing ? '✕' : '✏️'}
          </span>
          {isEditing ? 'Hủy' : 'Chỉnh sửa'}
        </button>
      </div>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <span className="avatar-icon">👤</span>
            </div>
          </div>
          <div className="profile-basic">
            <h2 className="profile-name">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                  className="name-input"
                  placeholder="Nhập họ tên"
                />
              ) : (
                profile.full_name
              )}
            </h2>
            <span className={`role-badge ${profile.role?.toLowerCase()}`}>
              {profile.role}
            </span>
            <div className="verification-status">
              <span className={`status-indicator ${profile.is_verified ? 'verified' : 'unverified'}`}>
                🛡️ {profile.is_verified ? 'Đã xác minh' : 'Chưa xác minh'}
              </span>
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="info-cards">
          {/* Contact Information */}
          <div className="info-card">
            <h3 className="card-title">
              <span className="title-icon">📧</span>
              Thông tin liên hệ
            </h3>
            <div className="card-content">
              <div className="info-row">
                <div className="info-item">
                  <label>Email</label>
                  <div className="info-value">
                    <span className="value-icon">📧</span>
                    <span>{profile.email}</span>
                  </div>
                </div>
                <div className="info-item">
                  <label>Số điện thoại</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone_number}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone_number: e.target.value }))}
                      placeholder="Nhập số điện thoại"
                      className="phone-input"
                    />
                  ) : (
                    <div className="info-value">
                      <span className="value-icon">📱</span>
                      <span>{profile.phone_number || "Chưa cập nhật"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="info-card">
            <h3 className="card-title">
              <span className="title-icon">⚙️</span>
              Trạng thái tài khoản
            </h3>
            <div className="card-content">
              <div className="status-grid">
                <div className="status-item">
                  <label>Trạng thái</label>
                  <span className={`status-badge ${profile.status?.toLowerCase()}`}>
                    {profile.status === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
                <div className="status-item">
                  <label>Xác minh</label>
                  <span className={`verification-badge ${profile.is_verified ? 'verified' : 'unverified'}`}>
                    {profile.is_verified ? 'Đã xác minh' : 'Chưa xác minh'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Information */}
          <div className="info-card">
            <h3 className="card-title">
              <span className="title-icon">🕒</span>
              Hoạt động
            </h3>
            <div className="card-content">
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-info">
                    <span className="activity-icon">📅</span>
                    <span className="activity-label">Ngày tạo tài khoản</span>
                  </div>
                  <span className="activity-value">
                    {formatDate(profile.created_at)}
                  </span>
                </div>
                <div className="activity-item">
                  <div className="activity-info">
                    <span className="activity-icon">🕒</span>
                    <span className="activity-label">Lần đăng nhập gần nhất</span>
                  </div>
                  <span className="activity-value">
                    {formatDate(profile.last_login)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="save-section">
              <button onClick={handleSave} className="save-btn">
                <span className="btn-icon">💾</span>
                Lưu thay đổi
              </button>
            </div>
          )}

          {/* Logout Button */}
          <div className="logout-section">
            <button onClick={handleLogout} className="logout-btn">
              <span className="btn-icon">🚪</span>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;