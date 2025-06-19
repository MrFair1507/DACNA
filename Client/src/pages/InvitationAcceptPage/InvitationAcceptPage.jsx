// src/pages/InvitationAcceptPage/InvitationAcceptPage.jsx
import React, { useEffect, useState } from "react";
import "./InvitationAcceptPage.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api"; // Axios instance

const InvitationAcceptPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const acceptInvitation = async () => {
      if (!token) {
        setError("Liên kết không hợp lệ.");
        setLoading(false);
        return;
      }

      try {
        const res = await api.post("/projects/accept", { token });

        if (res.data.requireRegistration) {
          // Nếu chưa có tài khoản → chuyển sang trang đăng ký
          navigate("/signup", {
            state: {
              email: res.data.email,
              message: "Vui lòng đăng ký tài khoản để tham gia dự án.",
            },
          });
        } else {
          // Đã xác nhận thành công
          setMessage(res.data.message || "Bạn đã tham gia dự án thành công!");
          setTimeout(() => {
            navigate("/dashboard");
          }, 2500);
        }
      } catch (err) {
        console.error("❌ Accept invitation error:", err);
        setError(
          err.response?.data?.message || "Không thể xác nhận lời mời. Liên kết có thể đã hết hạn."
        );
      } finally {
        setLoading(false);
      }
    };

    acceptInvitation();
  }, [token, navigate]);

  return (
    <div className="invitation-accept-page">
      <div className="invitation-box">
        {loading && <p>Đang xử lý lời mời...</p>}
        {!loading && message && <p className="success">{message}</p>}
        {!loading && error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default InvitationAcceptPage;
