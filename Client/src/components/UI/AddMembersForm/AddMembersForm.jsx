import React, { useState, useEffect } from "react";
import "./AddMembersForm.css";

const AddMembersForm = ({ onClose, onAddMembers }) => {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState(2);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/roles", {
        credentials: "include",
      });
      const data = await res.json();
      setRoles(data || []);
    } catch (err) {
      console.error("Lỗi khi lấy vai trò:", err);
      setRoles([
        { role_id: 1, role_name: "Project Manager" },
        { role_id: 2, role_name: "Backend Developer" },
        { role_id: 3, role_name: "Frontend Developer" },
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Vui lòng nhập email.");
      return;
    }
    const newMember = {
      email: email.trim(),
      role_id: selectedRole,
    };
    onAddMembers?.([newMember]);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Thêm thành viên</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Vai trò</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(Number(e.target.value))}
            >
              {roles.map((r) => (
                <option key={r.role_id} value={r.role_id}>
                  {r.role_name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="submit-btn">
              Thêm thành viên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMembersForm;
