import React, { useState } from "react";
import "./ProjectList.css";
import ProjectCard from "../ProjectCard";
import EditProjectForm from "../EditProjectForm";

const ProjectList = ({
  projects = [],
  onProjectSelect,
  onCreateProject,
  onProjectUpdated,
  onProjectDeleted,
}) => {
  const [editingProject, setEditingProject] = useState(null);

  const handleEditClick = (project) => {
    console.log("🔍 project to edit:", project);
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
            project={{
              ...project,
              status: project.project_status || project.status,
            }}
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
          project={{
            project_id: Number(editingProject.id?.replace("project", "")),
            project_name: editingProject.title,
            project_description: editingProject.description,
            project_status:
              editingProject.project_status ||
              editingProject.status ||
              "Planning",
          }}
          onClose={handleCloseEdit}
          onProjectUpdated={(updatedProject) => {
            handleCloseEdit();
            onProjectUpdated && onProjectUpdated(updatedProject);
          }}
          onProjectDeleted={(deletedId) => {
            handleCloseEdit();
            onProjectDeleted && onProjectDeleted(deletedId);
          }}
        />
      )}
    </div>
  );
};

export default ProjectList;
