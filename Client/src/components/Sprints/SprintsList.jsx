import React from "react";
import "./SprintsList.css";
import SprintCard from "./SprintsCard";

const SprintsList = ({
  sprints,
  onCreateSprint,
  onSprintClick,
  activeProjectId,
  projectId,
  projectMembers,
  onTaskCreated
}) => {
  return (
    <div className="sprints-container">
      <div className="sprints-header">
        <h2>{activeProjectId ? "Sprints của dự án" : "Tất cả các Sprints"}</h2>
        <button className="create-sprint-btn" onClick={onCreateSprint}>
          <span className="btn-icon">+</span>
          <span>Tạo Sprint mới</span>
        </button>
      </div>

      <div className="sprints-list">
        {sprints.length > 0 ? (
          sprints.map((sprint) => (
            <SprintCard
              key={sprint.id}
              sprint={sprint}
              onSprintClick={onSprintClick}
              projectId={projectId}
              projectMembers={projectMembers}
              onTaskCreated={onTaskCreated}
            />
          ))
        ) : (
          <div className="empty-sprints">
            <p>
              Chưa có sprint nào. Hãy tạo sprint đầu tiên để bắt đầu quản lý
              công việc.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SprintsList;
