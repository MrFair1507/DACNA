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

  return (
    <>
      <div className={`sprint-card ${getStatusClass(sprint.status)}`}>
        <div className="sprint-header">
          <h3 className="sprint-name">{sprint.name}</h3>
          <span className={`sprint-status ${getStatusClass(sprint.status)}`}>
            {getStatusText(sprint.status)}
          </span>
        </div>

        <div className="sprint-dates">
          <div className="date-group">
            <label>Bắt đầu</label>
            <span>{sprint.startDate}</span>
          </div>
          <div className="date-group">
            <label>Kết thúc</label>
            <span>{sprint.endDate}</span>
          </div>
        </div>

        <div className="sprint-progress">
          <div className="progress-info">
            <span>Tiến độ</span>
            <span>{sprint.progress}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${sprint.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="sprint-stats">
          <div className="stats-item">
            <span className="stats-label">Tổng số task</span>
            <span className="stats-value">{sprint.totalTasks}</span>
          </div>
          <div className="stats-item">
            <span className="stats-label">Đã hoàn thành</span>
            <span className="stats-value">{sprint.completedTasks}</span>
          </div>
        </div>

        <div className="sprint-actions">
          <button className="view-sprint-btn" onClick={() => onSprintClick(sprint)}>
            Xem chi tiết
          </button>
          {sprint.status === "active" && (
            <button className="complete-sprint-btn">Kết thúc Sprint</button>
          )}
          <button className="assign-backlog-btn" onClick={() => setShowBacklogForm(true)}>
            + Sprint Backlog
          </button>
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
