import React from "react";
import "./TaskCard.css";

const TaskCard = ({ task, onDragStart, onClick }) => {
const getPriorityClass = (priority) => {
  const p = (priority || "").toLowerCase();
  switch (p) {
    case "high":
      return "priority-high";
    case "medium":
      return "priority-medium";
    case "low":
      return "priority-low";
    default:
      return "";
  }
};

  const getPriorityText = (priority) => {
    switch (priority) {
      case "high":
        return "Cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return "";
    }
  };

  return (
    <div
      className="task-card"
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
    >
      <div className="task-card-header">
        <h4 className="task-title">{task.title}</h4>
        <div className={`priority-dot ${getPriorityClass(task.priority)}`} />
      </div>

      {task.sprint_backlog_title && (
        <div className="task-backlog-label">📋 {task.sprint_backlog_title}</div>
      )}

      <div className="task-meta">
        <div className="task-assignee">
          <div className="assignee-avatar">
            <span>{task.assigneeInitial}</span>
          </div>
          <span>{task.assignee}</span>
        </div>

        <div className="task-details">
          <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
            {getPriorityText(task.priority)}
          </span>
          <span className="due-date">{task.dueDate}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
