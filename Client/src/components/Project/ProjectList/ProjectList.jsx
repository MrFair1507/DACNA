import React, { useState } from "react";
import "./ProjectList.css";
import ProjectCard from "../ProjectCard";
import EditProjectForm from "../EditProjectForm";
 // hoặc nơi bạn đặt form

const ProjectList = ({ projects = [], onProjectSelect, onCreateProject }) => {
  const [editingProject, setEditingProject] = useState(null);

  const handleEditClick = (project) => {
    setEditingProject(project);
  };

  const handleCloseEdit = () => {
    setEditingProject(null);
  };

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
            onViewClick={() => onProjectSelect(project.id)}
            onEditClick={() => handleEditClick(project)} 
          />
        ))}

        <div
          className="project-card create-new-project"
          onClick={onCreateProject}
        >
          <div className="create-icon">+</div>
          <h3>Tạo dự án mới</h3>
        </div>
      </div>

      {editingProject && (
        <EditProjectForm
          project={editingProject}
          onClose={handleCloseEdit}
          onProjectUpdated={() => {
            handleCloseEdit();
            // 👉 bạn có thể gọi reload project list nếu cần
          }}
          onProjectDeleted={() => {
            handleCloseEdit();
            // 👉 reload project list nếu cần
          }}
        />
      )}
    </div>
  );
};

export default ProjectList;
