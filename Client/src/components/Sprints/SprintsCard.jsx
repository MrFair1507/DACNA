import React, { useState, useEffect } from "react";
import CreateSprintBacklogForm from "./CreateSprintBacklogForm";
import "./SprintsCard.css";
import api from "../../services/api";

const SprintCard = ({
  sprint,
  onSprintClick,
  projectId,
  projectMembers,
  onTaskCreated,
}) => {
  const [showBacklogForm, setShowBacklogForm] = useState(false);
  const [productBacklogs, setProductBacklogs] = useState([]);
  const [isExpired, setIsExpired] = useState(false);
  // ✅ State để tính thủ công tiến độ
  const [progress, setProgress] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  useEffect(() => {
    if (!showBacklogForm) return;

    const fetchBacklogs = async () => {
      try {
        const res = await api.get(`/projects/${projectId}/backlog`);
        setProductBacklogs(res.data.backlogs || []);
      } catch (err) {
        console.error("❌ Lỗi tải backlog:", err);
      }
    };

    fetchBacklogs();
  }, [showBacklogForm, projectId]);

  // ✅ Tính tiến độ từ các task
  useEffect(() => {
    const calculateProgress = async () => {
      try {
        const res = await api.get(`/sprints/${sprint.sprint_id}/backlog`);
        const sprintBacklogs = res.data || [];

        if (sprintBacklogs.length === 0) {
          setProgress(0);
          setTotalTasks(0);
          setCompletedTasks(0);
          return;
        }

        let allTasks = [];

        const taskRequests = sprintBacklogs.map((backlog) =>
          api.get(`/tasks/backlog/${backlog.sprint_backlog_id}/tasks`)
        );

        const taskResponses = await Promise.all(taskRequests);

        taskResponses.forEach((res) => {
          const tasks = res.data || [];
          allTasks = allTasks.concat(tasks);
        });

        const total = allTasks.length;
        const completed = allTasks.filter(
          (t) => t.task_status === "Completed"
        ).length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        setProgress(percent);
        setTotalTasks(total);
        setCompletedTasks(completed);
      } catch (err) {
        console.error("❌ Lỗi khi tính tiến độ Sprint:", err);
      }
    };

    calculateProgress();
  }, [sprint.sprint_id]);
  useEffect(() => {
    const now = new Date();
    const sprintEnd = new Date(sprint.endDate);
    setIsExpired(now > sprintEnd);
  }, [sprint.endDate]);

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "status-completed";
      case "active":
        return "status-active";
      default:
        return "status-planned";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "active":
        return "Đang tiến hành";
      default:
        return "Đã lên kế hoạch";
    }
  };
  const formatDate = (rawDate) => {
    const date = new Date(rawDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <div
        className={`sprint-card ${getStatusClass(sprint.status)}`}
        onClick={() => onSprintClick(sprint)}
        style={{ cursor: "pointer" }}
      >
        <div className="sprint-header">
          <h3 className="sprint-name">{sprint.name}</h3>
          <span className={`sprint-status ${getStatusClass(sprint.status)}`}>
            {getStatusText(sprint.status)}
          </span>
        </div>

        <div className="sprint-dates">
          <div className="date-group">
            <label>Bắt đầu</label>
            <span className="sprint-date-value">
              {formatDate(sprint.startDate || sprint.start_date)}
            </span>
          </div>
          <div className="date-group">
            <label>Kết thúc</label>
            <span className="sprint-date-value">
              {formatDate(sprint.endDate || sprint.end_date)}
            </span>
          </div>
        </div>

        <div className="sprint-progress">
          <div className="progress-info">
            <span>Tiến độ</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="sprint-stats">
          <div className="stats-item">
            <span className="stats-label">Tổng số task</span>
            <span className="stats-value">{totalTasks}</span>
          </div>
          <div className="stats-item">
            <span className="stats-label">Đã hoàn thành</span>
            <span className="stats-value">{completedTasks}</span>
          </div>
        </div>

        <div className="sprint-actions">
          <button
            className="view-sprint-btn"
            onClick={() => onSprintClick(sprint)}
          >
            Xem chi tiết
          </button>
          {sprint.status === "active" && (
            <button className="complete-sprint-btn">Kết thúc Sprint</button>
          )}
          {!isExpired ? (
            <button
              className="assign-backlog-btn"
              onClick={(e) => {
                e.stopPropagation(); // ✅ Ngăn lan ra thẻ cha
                setShowBacklogForm(true);
              }}
            >
              + Sprint Backlog
            </button>
          ) : (
            <span className="sprint-expired-warning">Sprint đã hết hạn</span>
          )}
        </div>
      </div>

      {showBacklogForm && (
        <CreateSprintBacklogForm
          sprint={sprint}
          projectId={projectId}
          productBacklogs={productBacklogs}
          projectMembers={projectMembers}
          onTaskCreated={onTaskCreated}
          onClose={() => setShowBacklogForm(false)}
          onSubmit={(items) => {
            console.log("🧾 Sprint backlog đã thêm:", items);
            setShowBacklogForm(false);
          }}
        />
      )}
    </>
  );
};

export default SprintCard;
