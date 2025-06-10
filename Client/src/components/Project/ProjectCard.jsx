import React, { useState } from "react";
import "./ProjectCard.css";

const ProjectCard = ({ project, onEditClick, onViewClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="project-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
     

      <div className="project-info" style={{ opacity: hovered ? 0.15 : 1 }}>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <div className="project-meta">
          <span className="project-owner">{project.owner}</span>
          <span className="project-members">{project.members} thành viên</span>
          <span className="project-updated">Cập nhật: {project.lastModified}</span>
        </div>
      </div>

      {hovered && (
        <div className="project-overlay">
          <button className="overlay-btn" onClick={onViewClick}>👁 Xem</button>
          <button className="overlay-btn" onClick={onEditClick}>✏️ Chỉnh sửa</button>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
