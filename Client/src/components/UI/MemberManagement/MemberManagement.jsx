import React, { useState } from 'react';
import './MembersManagement.css';
import AddMembersForm from './AddMembersForm';

const MembersManagement = ({ boardId }) => {
  const [showAddMembersForm, setShowAddMembersForm] = useState(false);
  const [members, setMembers] = useState([
    { id: 'u1', name: 'Minh Huynh', role: 'Admin', avatar: 'M', lastActive: '21/04/2025' },
    { id: 'u2', name: 'Dang Ho', role: 'Member', avatar: 'D', lastActive: '20/04/2025' },
    { id: 'u3', name: 'Tri Vu', role: 'Member', avatar: 'T', lastActive: '19/04/2025' },
  ]);
  const [invites, setInvites] = useState([
    { email: 'kien@example.com', status: 'pending', date: '21/04/2025' },
  ]);
  
  const handleAddMembers = (newMembers, method) => {
    if (method === 'email') {
      // Thêm email vào danh sách lời mời
      const newInvites = newMembers.map(({ email }) => ({
        email,
        status: 'pending',
        date: new Date().toLocaleDateString('vi-VN')
      }));
      
      setInvites([...invites, ...newInvites]);
    } else if (method === 'users') {
      // Thêm người dùng đã chọn vào danh sách thành viên
      const newMembersList = newMembers.map(user => ({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        role: 'Member',
        lastActive: new Date().toLocaleDateString('vi-VN')
      }));
      
      // Lọc ra những người dùng chưa có trong danh sách
      const filteredNewMembers = newMembersList.filter(
        newMember => !members.some(member => member.id === newMember.id)
      );
      
      setMembers([...members, ...filteredNewMembers]);
    } else if (method === 'team') {
      // Hiển thị thông báo thêm cả team thành công
      console.log(`Đã thêm cả team ${newMembers.teamName} vào bảng`);
      // Trong thực tế, bạn sẽ gọi API để thêm tất cả thành viên của team
    }
  };
  
  const handleRemoveMember = (memberId) => {
    setMembers(members.filter(member => member.id !== memberId));
  };
  
  const handleCancelInvite = (email) => {
    setInvites(invites.filter(invite => invite.email !== email));
  };
  
  const handleChangeRole = (memberId, newRole) => {
    setMembers(members.map(member => 
      member.id === memberId 
        ? { ...member, role: newRole } 
        : member
    ));
  };

  return (
    <div className="members-management">
      <div className="members-header">
        <h2>Quản lý thành viên</h2>
        <button 
          className="add-members-btn"
          onClick={() => setShowAddMembersForm(true)}
        >
          <span className="btn-icon">+</span>
          <span>Thêm thành viên</span>
        </button>
      </div>
      
      {/* Danh sách thành viên */}
      <div className="members-section">
        <h3>Thành viên ({members.length})</h3>
        
        <div className="members-list">
          {members.map(member => (
            <div key={member.id} className="member-item">
              <div className="member-avatar">{member.avatar}</div>
              <div className="member-details">
                <div className="member-name">{member.name}</div>
                <div className="member-meta">Hoạt động gần đây: {member.lastActive}</div>
              </div>
              <div className="member-role">
                <select 
                  value={member.role}
                  onChange={(e) => handleChangeRole(member.id, e.target.value)}
                  className="role-select"
                >
                  <option value="Admin">Admin</option>
                  <option value="Member">Thành viên</option>
                  <option value="Observer">Người quan sát</option>
                </select>
              </div>
              <button 
                className="remove-member-btn"
                onClick={() => handleRemoveMember(member.id)}
              >
                <i className="icon-remove">×</i>
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Danh sách lời mời */}
      {invites.length > 0 && (
        <div className="invites-section">
          <h3>Lời mời đang chờ ({invites.length})</h3>
          
          <div className="invites-list">
            {invites.map(invite => (
              <div key={invite.email} className="invite-item">
                <div className="invite-icon">
                  <i className="icon-envelope">✉</i>
                </div>
                <div className="invite-details">
                  <div className="invite-email">{invite.email}</div>
                  <div className="invite-status">
                    <span className="status-badge">Đang chờ phản hồi</span>
                    <span className="invite-date">Gửi lúc: {invite.date}</span>
                  </div>
                </div>
                <button 
                  className="cancel-invite-btn"
                  onClick={() => handleCancelInvite(invite.email)}
                >
                  <span>Hủy lời mời</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Quyền truy cập bảng */}
      <div className="board-access-section">
        <h3>Truy cập bảng</h3>
        
        <div className="access-options">
          <div className="access-option">
            <div className="option-label">
              <h4>Quyền xem</h4>
              <p>Ai có thể xem bảng này?</p>
            </div>
            <select className="access-select">
              <option value="members">Chỉ thành viên được mời</option>
              <option value="workspace">Tất cả thành viên trong workspace</option>
              <option value="organization">Tất cả thành viên trong tổ chức</option>
            </select>
          </div>
          
          <div className="access-option">
            <div className="option-label">
              <h4>Quyền chỉnh sửa</h4>
              <p>Ai có thể chỉnh sửa bảng này?</p>
            </div>
            <select className="access-select">
              <option value="members">Chỉ thành viên được mời</option>
              <option value="admin">Chỉ admin</option>
            </select>
          </div>
          
          <div className="access-option">
            <div className="option-label">
              <h4>Chia sẻ liên kết</h4>
              <p>Cho phép truy cập qua liên kết?</p>
            </div>
            <div className="toggle-switch-wrapper">
              <label className="toggle-switch">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
              <span className="toggle-label">Tắt</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Form thêm thành viên */}
      {showAddMembersForm && (
        <AddMembersForm 
          onClose={() => setShowAddMembersForm(false)}
          onAddMembers={handleAddMembers}
        />
      )}
    </div>
  );
};

export default MembersManagement;