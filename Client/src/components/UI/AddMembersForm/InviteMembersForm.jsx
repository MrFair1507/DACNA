import React, { useState, useEffect } from "react";
import "./AddMembersForm.css"; // tái sử dụng CSS cũ cho popup
import api from "../../../services/api";

const InviteMembersForm = ({ projectId, onClose }) => {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState(2);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await api.get("/roles", { withCredentials: true });
      setRoles(res.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy vai trò:", err);
      setRoles([
        { role_id: 1, role_name: "Project Manager" },
        { role_id: 2, role_name: "Backend Developer" },
        { role_id: 3, role_name: "Frontend Developer" },
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Vui lòng nhập email.");
      return;
    }

    try {
      await api.post(
        "/projects/send",
        {
          projectId,
          emails: [email.trim()],
          role: selectedRole,
          message: "",
        },
        { withCredentials: true }
      );

      setSuccess(`✅ Đã gửi lời mời đến ${email.trim()}`);
      setEmail("");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(`❌ Không thể gửi lời mời: ${msg}`);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Mời thành viên</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

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
              Gửi lời mời
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMembersForm;
