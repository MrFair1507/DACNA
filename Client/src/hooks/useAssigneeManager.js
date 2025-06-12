import { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext"; 

const useAssigneeManager = (taskId) => {
  const [currentAssignee, setCurrentAssignee] = useState(null);
  const { user } = useContext(AuthContext); // ✅ Lấy user từ context

  // Load người phụ trách hiện tại
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await api.get("/task-assignments");
        const found = res.data.find((a) => a.task_id === taskId);
        setCurrentAssignee(found || null);
      } catch (err) {
        console.error("❌ Lỗi khi tải assignee:", err);
      }
    };

    if (taskId) fetchAssignment();
  }, [taskId]);

  // Gán người phụ trách
  const assignUserToTask = async (newUserId) => {
    try {
      if (!newUserId) return;

      const currentUserId = user?.user_id;
      if (!currentUserId) {
        console.warn("⚠️ Không tìm thấy user_id từ AuthContext.");
        alert("Không thể gán người phụ trách vì thiếu thông tin người dùng.");
        return;
      }

      const existing = currentAssignee;
      if (existing?.user_id === newUserId) return;

      // Nếu đã có phân công cũ → xoá trước
      if (existing?.assignment_id) {
        await api.delete(`/task-assignments/${existing.assignment_id}`);
      }

      // Tạo phân công mới
      const res = await api.post("/task-assignments", {
        task_id: taskId,
        user_id: newUserId,
        assigned_by: currentUserId,
        completion_percentage: 0,
        status: "Assigned",
      });

      setCurrentAssignee({
        task_id: taskId,
        user_id: newUserId,
        assignment_id: res.data.assignment_id,
      });
    } catch (err) {
      console.error("❌ Lỗi khi gán người phụ trách:", err);
    }
  };

  return { currentAssignee, assignUserToTask };
};

export default useAssigneeManager;
