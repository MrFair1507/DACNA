import React, { useState } from 'react';
import './AddMembersForm.css';

const AddMembersForm = ({ onClose, onAddMembers }) => {
  const [addMethod, setAddMethod] = useState('email'); // 'email', 'users', 'team'
  const [emails, setEmails] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  // Mock data cho users và teams
  const availableUsers = [
    { id: 'u1', name: 'Minh Huynh', email: 'minh@example.com', avatar: 'M' },
    { id: 'u2', name: 'Dang Ho', email: 'dang@example.com', avatar: 'D' },
    { id: 'u3', name: 'Tri Vu', email: 'tri@example.com', avatar: 'T' },
    { id: 'u4', name: 'Khoa Nguyen', email: 'khoa@example.com', avatar: 'K' },
    { id: 'u5', name: 'Dat Chau', email: 'dat@example.com', avatar: 'D' },
  ];
  
  const availableTeams = [
    { id: 't1', name: 'Team Dev', members: 6 },
    { id: 't2', name: 'Team Design', members: 4 },
    { id: 't3', name: 'Team Marketing', members: 3 },
  ];
  
  // Lọc users dựa trên từ khóa tìm kiếm
  const filteredUsers = availableUsers.filter(user => 
    user.name.toLowerCase().includes(searchUser.toLowerCase()) || 
    user.email.toLowerCase().includes(searchUser.toLowerCase())
  );
  
  const handleAddMethod = (method) => {
    setAddMethod(method);
    setSelectedUsers([]);
  };
  
  const handleSelectUser = (user) => {
    if (selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    let usersToAdd = [];
    
    if (addMethod === 'email') {
      // Xử lý thêm qua email
      const emailList = emails.split(/[,;\n]/)
        .map(email => email.trim())
        .filter(email => email && email.includes('@')); // Thêm kiểm tra email hợp lệ
      
      // Loại bỏ email trùng lặp
      const uniqueEmails = [...new Set(emailList)];
      usersToAdd = uniqueEmails.map(email => ({ email }));
    } else if (addMethod === 'users') {
      // Chỉ thêm người dùng đã chọn (không cần lọc trùng lặp vì selectedUsers đã là mảng duy nhất)
      usersToAdd = selectedUsers;
    } else if (addMethod === 'team') {
      // Thêm toàn bộ team
      const team = availableTeams.find(t => t.id === selectedTeam);
      if (team) {
        usersToAdd = { teamId: team.id, teamName: team.name };
      }
    }
    
    // Chỉ gọi callback khi có người dùng để thêm
    if (usersToAdd.length > 0 || (addMethod === 'team' && usersToAdd.teamId)) {
      if (onAddMembers) {
        onAddMembers(usersToAdd, addMethod);
      }
      onClose();
    } else {
      // Thông báo khi không có người dùng nào được chọn
      alert('Vui lòng chọn hoặc nhập thông tin thành viên để thêm');
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="modal-container add-members-modal">
        <div className="modal-header">
          <h3>Thêm thành viên vào bảng</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="add-method-tabs">
            <button 
              className={`method-tab ${addMethod === 'email' ? 'active' : ''}`}
              onClick={() => handleAddMethod('email')}
            >
              Qua Email
            </button>
            <button 
              className={`method-tab ${addMethod === 'users' ? 'active' : ''}`}
              onClick={() => handleAddMethod('users')}
            >
              Từ danh sách
            </button>
            <button 
              className={`method-tab ${addMethod === 'team' ? 'active' : ''}`}
              onClick={() => handleAddMethod('team')}
            >
              Thêm cả team
            </button>
          </div>
          
          {addMethod === 'email' && (
            <div className="email-input-section">
              <div className="form-group">
                <label className="form-label">Nhập email thành viên</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  placeholder="Nhập một hoặc nhiều email, phân cách bằng dấu phẩy hoặc xuống dòng"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                ></textarea>
                <div className="form-tip">
                  Hệ thống sẽ tự động gửi email mời nếu người dùng chưa có tài khoản
                </div>
              </div>
            </div>
          )}
          
          {addMethod === 'users' && (
            <div className="users-list-section">
              <div className="search-users">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Tìm kiếm người dùng..." 
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                />
              </div>
              
              <div className="users-list">
                {filteredUsers.map(user => (
                  <div 
                    key={user.id}
                    className={`user-item ${selectedUsers.find(u => u.id === user.id) ? 'selected' : ''}`}
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="user-avatar">{user.avatar}</div>
                    <div className="user-details">
                      <div className="user-name">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                    <div className="user-select-indicator">
                      {selectedUsers.find(u => u.id === user.id) && (
                        <div className="check-icon">✓</div>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredUsers.length === 0 && (
                  <div className="no-users-found">
                    Không tìm thấy người dùng phù hợp
                  </div>
                )}
              </div>
              
              <div className="selected-count">
                Đã chọn: {selectedUsers.length} người dùng
              </div>
            </div>
          )}
          
          {addMethod === 'team' && (
            <div className="teams-section">
              <div className="form-group">
                <label className="form-label">Chọn team</label>
                <select 
                  className="form-control"
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                >
                  <option value="">-- Chọn team --</option>
                  {availableTeams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.members} thành viên)
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedTeam && (
                <div className="team-info">
                  <div className="team-members-info">
                    Tất cả {availableTeams.find(t => t.id === selectedTeam)?.members || 0} thành viên 
                    của team sẽ được thêm vào bảng và nhận thông báo qua email.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Hủy</button>
          <button 
            className="submit-btn" 
            onClick={handleSubmit}
            disabled={(addMethod === 'email' && !emails.trim()) || 
                    (addMethod === 'users' && selectedUsers.length === 0) ||
                    (addMethod === 'team' && !selectedTeam)}
          >
            Thêm thành viên
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMembersForm;