import React, { useState } from "react";
import "./AddMembersForm.css";
import api from "../../../services/api";

const AddMembersForm = ({ projectId, onClose, onAddMembers }) => {
  const [emails, setEmails] = useState([""]);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("Member");
  const [loading, setLoading] = useState(false);

  const handleChangeEmail = (index, value) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  };

  const handleAddEmail = () => {
    setEmails([...emails, ""]);
  };

  const handleRemoveEmail = (index) => {
    const updated = emails.filter((_, i) => i !== index);
    setEmails(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validEmails = emails.filter((email) => email.trim() !== "");
    if (validEmails.length === 0 || !projectId) return;

    try {
      setLoading(true);
      const res = await api.post(
        "/invitations/send",
        {
          projectId,
          emails: validEmails,
          role,
          message,
        },
        { withCredentials: true }
      );

      onAddMembers?.(res.data.invitations, "email");
      onClose();
    } catch (err) {
      console.error("❌ Gửi lời mời thất bại:", err.response?.data || err.message);
      alert("Lỗi khi gửi lời mời. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Mời thành viên qua email</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {emails.map((email, index) => (
              <div key={index} className="email-row">
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => handleChangeEmail(index, e.target.value)}
                  required
                />
                {emails.length > 1 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleRemoveEmail(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="add-email-btn"
              onClick={handleAddEmail}
            >
              + Thêm email
            </button>

            <label>Ghi chú (tùy chọn)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Bạn được mời tham gia dự án..."
              rows={3}
            />

            <label>Vai trò</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Member">Thành viên</option>
              <option value="Admin">Quản trị viên</option>
              <option value="Observer">Người quan sát</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="cancel-btn">
              Hủy
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi lời mời"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMembersForm;
