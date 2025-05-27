import React, { useState } from "react";
import AddTaskForm from "../Project/AddTaskForm";

const SprintBacklogCard = ({ backlog, sprint, projectId, projectMembers, onTaskCreated }) => {
  const [showTaskForm, setShowTaskForm] = useState(false);

  return (
    <div className="sprint-backlog-card">
      <div className="card-header">
        <h4>{backlog.title}</h4>
        <p>{backlog.description || <i>Không có mô tả</i>}</p>
        <div style={{ fontSize: "13px", color: "#ccc", marginTop: "4px" }}>
          <strong>Trạng thái:</strong> {backlog.status || "Assigned"}
        </div>
      </div>

      <div className="card-footer">
        <button onClick={() => setShowTaskForm(true)}>+ Tạo Task</button>
      </div>

      {showTaskForm && (
        <AddTaskForm
          sprintId={sprint.id}
          projectId={projectId}
          sprintBacklogId={backlog.sprint_backlog_id}
          projectMembers={projectMembers}
          onClose={() => setShowTaskForm(false)}
          onSubmit={(task) => {
            onTaskCreated?.(task);
            setShowTaskForm(false);
          }}
        />
      )}
    </div>
  );
};

export default SprintBacklogCard;
