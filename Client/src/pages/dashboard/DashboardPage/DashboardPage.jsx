
// 📁 src/pages/dashboard/DashboardPage/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import "./DashboardPage.css";

import Sidebar from "../../../components/Layout/Sidebar/Sidebar";
// import Header from "../../../components/Layout/Header/MainHeader/MainHeader";
import ProjectList from "../../../components/Project/ProjectList/ProjectList";
import SprintsPage from "../../Sprints/SprintsPage";
import CreateProjectForm from "../../../components/UI/CreateProjectForm/CreateProjectForm";
import CreateSprintForm from "../../../components/Sprints/CreateSprintForm";
import api from "../../../services/api";
import MainHeader from "../../../components/Layout/Header/MainHeader/MainHeader";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString("vi-VN");

  const [activeView, setActiveView] = useState("projectList");
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeTab, setActiveTab] = useState("project");

  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState({});
  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false);
  const [showCreateSprintForm, setShowCreateSprintForm] = useState(false);
  const [justCreatedProjectId, setJustCreatedProjectId] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects", { withCredentials: true });
        const formatted = response.data.map((p) => ({
          id: `project${p.project_id}`,
          title: p.project_name,
          description: p.project_description,
          color: "blue",
          owner: `User ${p.created_by}`,
          members: 1,
          template: "default",
          lastModified: new Date(
            p.updated_at || p.created_at
          ).toLocaleDateString("vi-VN"),
        }));
        setProjects(formatted);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách dự án:", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (justCreatedProjectId) {
      handleTabSelect(justCreatedProjectId, "sprints");
      setJustCreatedProjectId(null);
    }
  }, [justCreatedProjectId]);

  const handleProjectSelect = (projectId) => {
    if (projectId) {
      const realProjectId = projectId.replace("project", "");
      navigate(`/dashboard/${realProjectId}/sprints`);
    }
  };

  const handleTabSelect = async (projectId, tab) => {
    setActiveProjectId(projectId);
    setActiveTab(tab);

    if (tab === "sprints") {
      setActiveView("sprints");
      const realProjectId = Number(projectId.replace("project", ""));
      try {
        const response = await api.get(`/sprints?project_id=${realProjectId}`);
        const sprintsFromApi = Array.isArray(response.data)
          ? response.data
          : response.data.sprints;
        const mapped = sprintsFromApi.map((s) => ({
          id: s.sprint_id,
          name: s.name,
          description: s.description,
          startDate: s.start_date,
          endDate: s.end_date,
          status: s.status || "planned",
          totalTasks: s.totalTasks || 0,
          completedTasks: s.completedTasks || 0,
          progress: s.progress || 0,
        }));
        setSprints((prev) => ({
          ...prev,
          [`project${realProjectId}`]: mapped,
        }));
      } catch (error) {
        console.error(
          "❌ Lỗi khi gọi API:",
          error.response?.data || error.message
        );
      }
    }
  };

  const handleCreateProject = () => setShowCreateProjectForm(true);

  const handleProjectCreated = (projectData) => {
    const newProjectId = `project${projectData.project_id}`;
    const newProject = {
      id: newProjectId,
      title: projectData.title,
      color: projectData.color,
      description: projectData.description,
      owner: `${user?.firstName || "Người"} ${user?.lastName || "dùng"}`,
      members: projectData.members?.length || 1,
      template: projectData.templateType,
      lastModified: currentDate,
    };
    setProjects((prev) => [...prev, newProject]);
    setSprints((prev) => ({ ...prev, [newProjectId]: [] }));
    setShowCreateProjectForm(false);
    setJustCreatedProjectId(newProjectId);
  };

  const handleCreateSprint = () => setShowCreateSprintForm(true);

  const renderContent = () => {
    switch (activeView) {
      case "projectList":
        return (
          <ProjectList
            projects={projects}
            onProjectSelect={handleProjectSelect}
            onCreateProject={handleCreateProject}
          />
        );
      case "sprints":
        return (
          <SprintsPage
            sprints={sprints[activeProjectId] || []}
            onCreateSprint={handleCreateSprint}
            onSprintClick={(sprint) => {
              const realProjectId = activeProjectId.replace("project", "");
              navigate(
                `/dashboard/${realProjectId}/sprints/${sprint.id}/tasks`
              );
            }}
            activeProjectId={activeProjectId}
          />
        );
      default:
        return (
          <ProjectList
            projects={projects}
            onProjectSelect={handleProjectSelect}
            onCreateProject={handleCreateProject}
          />
        );
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        projects={projects}
        activeTab={activeTab}
        activeProjectId={activeProjectId}
        onProjectSelect={handleProjectSelect}
        onTabSelect={handleTabSelect}
      />

      <div className="main-content">
        {/* <Header
          user={user}
          activeView={activeView}
          activeTab={activeTab}
          activeProjectId={activeProjectId}
          project={projects.find((p) => p.id === activeProjectId)}
          onTabSelect={handleTabSelect}
        /> */}
         <MainHeader />

        <div className="content-area">{renderContent()}</div>
      </div>

      {showCreateProjectForm && (
        <CreateProjectForm
          onClose={() => setShowCreateProjectForm(false)}
          onProjectCreated={handleProjectCreated}
          availableUsers={[]} // optional
          currentUserId={user?.user_id}
        />
      )}

      {showCreateSprintForm && (
        <CreateSprintForm
          onClose={() => setShowCreateSprintForm(false)}
          onSubmit={() => handleTabSelect(activeProjectId, "sprints")}
        />
      )}
    </div>
  );
};

export default DashboardPage;
