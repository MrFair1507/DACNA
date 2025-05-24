import React, { useState } from "react";
import "./MembersManagement.css";
import AddMembersForm from "./AddMembersForm";

const MembersManagement = ({ projectId }) => {
  const [showAddMembersForm, setShowAddMembersForm] = useState(false);

  const handleAddMembers = (newMembers, method) => {
    console.log("📥 Thành viên được thêm:", newMembers, "Phương thức:", method);
    // Tuỳ chỉnh xử lý hoặc gọi API ở đây nếu cần
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

      {/* Modal form thêm thành viên */}
      {showAddMembersForm && (
        <AddMembersForm
          projectId={realProjectId}
          onClose={() => setShowAddMembersForm(false)}
          onAddMembers={(invitedList) => {
            console.log("✅ Đã gửi lời mời:", invitedList);
          }}
        />
      )}
    </div>
  );
};

export default MembersManagement;
