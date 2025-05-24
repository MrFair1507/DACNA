import React, { useState } from "react";
import Sidebar from "../../components/Layout/Sidebar/Sidebar";
import SprintsList from "../../components/Sprints/SprintsList";
import CreateSprintForm from "../../components/Sprints/CreateSprintForm";
import SprintsHeader from "../../components/Layout/Header/SprintsHeader/SprintsHeader";
import api from "../../services/api";
import "./SprintsPage.css";
import MainHeader from "../../components/Layout/Header/MainHeader/MainHeader";

const SprintsPage = ({
  sprints: initialSprints,
  onSprintClick,
  activeProjectId,
  projects = [],
  user = null,
}) => {
  const [showCreateSprintForm, setShowCreateSprintForm] = useState(false);
  const [sprints, setSprints] = useState(initialSprints || []);

  const currentProject = projects.find((p) => p.id === activeProjectId);

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const handleCreateSprint = async (sprintData) => {
    const realProjectId = activeProjectId.replace("project", "");
    const fullSprintData = {
      project_id: Number(realProjectId),
      name: sprintData.name,
      description: sprintData.description,
      start_date: formatDate(sprintData.startDate),
      end_date: formatDate(sprintData.endDate),
      color: sprintData.color,
    };

    try {
      await api.post("/sprints", fullSprintData, { withCredentials: true });

      const response = await api.get(`/sprints?project_id=${realProjectId}`);
      const fetched = Array.isArray(response.data)
        ? response.data
        : response.data.sprints || [];

      const mapped = fetched.map((s) => ({
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

      setSprints(mapped);
      setShowCreateSprintForm(false);
    } catch (err) {
      console.error("❌ Lỗi tạo Sprint:", err);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        projects={projects}
        activeTab="sprints"
        activeProjectId={activeProjectId}
        onProjectSelect={(id) => {
          if (!id) {
            window.location.href = "/dashboard";
          } else {
            const realId = id.replace("project", "");
            window.location.href = `/dashboard/${realId}/sprints`;
          }
        }}
        onTabSelect={(id, tab) => {
          if (tab === "project") {
            window.location.href = "/dashboard";
          } else if (tab === "sprints") {
            window.location.href = `/dashboard/${id}/sprints`;
          } else if (tab === "backlog") {
            window.location.href = `/dashboard/${id}/backlog`;
          } else if (tab === "reports") {
            window.location.href = `/dashboard/${id}/reports`;
          }
        }}
      />

      <div className="main-content">
      <MainHeader/>
        <SprintsHeader
          project={currentProject}
          activeTab="sprints"
          onTabSelect={(id, tab) => {
            if (tab === "sprints") {
              window.location.href = `/dashboard/${id}/sprints`;
            } else if (tab === "backlog") {
              window.location.href = `/dashboard/${id}/backlog`;
            } else if (tab === "reports") {
              window.location.href = `/dashboard/${id}/reports`;
            }
          }}
        />

        <div className="content-area">
          <SprintsList
            sprints={sprints}
            onCreateSprint={() => setShowCreateSprintForm(true)}
            onSprintClick={onSprintClick}
            activeProjectId={activeProjectId}
          />
        </div>
      </div>

      {showCreateSprintForm && (
        <CreateSprintForm
          onClose={() => setShowCreateSprintForm(false)}
          onSubmit={handleCreateSprint}
        />
      )}
    </div>
  );
};

export default SprintsPage;
