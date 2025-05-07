import React from "react";
import "./ProjectCard.css";

const ProjectCard = ({ project, onClick }) => {
  return (
    <div className="project-card" onClick={onClick}>
      <div className={`project-color color-${project.color}`} />
      <div className="project-info">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <div className="project-meta">
          <span className="project-owner">{project.owner}</span>
          <span className="project-members">{project.members} thành viên</span>
          <span className="project-updated">Cập nhật: {project.lastModified}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
