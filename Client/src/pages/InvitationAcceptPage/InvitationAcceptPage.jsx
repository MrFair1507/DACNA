import React, { useEffect, useState, useContext } from "react";
import "./InvitationAcceptPage.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const InvitationAcceptPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const { setUser } = useContext(AuthContext);
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
        const res = await api.post("/invitations/accept", { token });

        if (res.data.requireRegistration) {
          // 🔁 Nếu chưa có tài khoản
          navigate("/signup", {
            state: {
              email: res.data.email,
              message: "Vui lòng đăng ký tài khoản để tham gia dự án.",
            },
          });
          return;
        }

        const invitedUser = res.data.user;
        const accessToken = res.data.token;

        // 📦 Dữ liệu local hiện tại
        const localUser = JSON.parse(localStorage.getItem("user"));

        // ❌ Nếu đã login bằng user khác → clear và yêu cầu đăng nhập lại
        if (localUser && localUser.email !== invitedUser.email) {
          localStorage.clear();
          setTimeout(() => {
            navigate(`/signin?redirect=/invitation/accept?token=${token}`);
          }, 1000);
          return;
        }

        // ✅ Đúng user → lưu vào localStorage
        const userData = {
          user_id: invitedUser.user_id || invitedUser.id,
          email: invitedUser.email,
          fullName: invitedUser.full_name,
          role: invitedUser.role,
          token: accessToken,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", accessToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        setUser(userData);

        setMessage(res.data.message || "Bạn đã tham gia dự án thành công!");

        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);

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
  }, [token, navigate, setUser]);

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
