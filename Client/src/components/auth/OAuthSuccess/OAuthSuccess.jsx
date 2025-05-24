import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import api from "../../../services/api"; // dùng axios đã config sẵn

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // ✅ cần expose setUser từ context như bạn đã làm

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    // ✅ Gán token vào localStorage và axios
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // ✅ Gọi API /auth/me để lấy thông tin user
    api
      .get("/auth/me", { withCredentials: true }) // gọi qua axios đã setup baseURL
      .then((res) => {
        if (res.data && res.data.email) {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
          navigate("/dashboard");
        } else {
          navigate("/signin");
        }
      })
      .catch((err) => {
        console.error("❌ OAuth fetch user error:", err);
        navigate("/signin");
      });
  }, [navigate, setUser]);

  return <p>Đang đăng nhập bằng tài khoản Google/Facebook...</p>;
};

export default OAuthSuccess;
