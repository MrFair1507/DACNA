
import React from "react";
import "./ProjectList.css";
import ProjectCard from "../ProjectCard";

const ProjectList = ({ projects = [], onProjectSelect, onCreateProject }) => {
  return (
    <div className="project-list-container">
      <div className="project-list-header">
        <h2>Dự án của tôi</h2>
        <button className="create-project-btn" onClick={onCreateProject}>
          <span className="btn-icon">+</span>
          <span>Tạo dự án mới</span>
        </button>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => onProjectSelect(project.id)}
          />
        ))}

        <div className="project-card create-new-project" onClick={onCreateProject}>
          <div className="create-icon">+</div>
          <h3>Tạo dự án mới</h3>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
