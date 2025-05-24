import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Layout/Sidebar/Sidebar";
import MainHeader from "../../components/Layout/Header/MainHeader/MainHeader";
import SprintsHeader from "../../components/Layout/Header/SprintsHeader/SprintsHeader";
import api from "../../services/api";
import SprintBacklogList from "../../components/SprintBacklog/SprintBacklogList";
import AddSprintBacklog from "../../components/SprintBacklog/AddSprintBacklog";
import "../dashboard/DashboardPage/DashboardPage.css";

const ProductBacklogPage = () => {
  const [projects, setProjects] = useState([]);
  const [backlogs, setBacklogs] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [showAddBacklog, setShowAddBacklog] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await api.get("/projects");
      const formatted = res.data.map((p) => ({
        id: `project${p.project_id}`,
        title: p.project_name,
        description: p.project_description,
        color: p.color || "blue",
      }));
      setProjects(formatted);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (activeProjectId) {
      const realId = activeProjectId.replace("project", "");
      api.get(`/projects/${realId}/backlogs`).then((res) => {
        setBacklogs(res.data.backlogs || []);
      });
    }
  }, [activeProjectId]);
  useEffect(() => {
    console.log("✅ AddSprintBacklog rendered");
  }, []);

  const currentProject = projects.find((p) => p.id === activeProjectId);
  const realSprintId = activeProjectId
    ? activeProjectId.replace("project", "")
    : null;

  return (
    <div className="dashboard-container">
      <Sidebar
        projects={projects}
        activeProjectId={activeProjectId}
        activeTab="backlog"
        onProjectSelect={(id) => setActiveProjectId(id)}
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
        <MainHeader />
        <SprintsHeader
          project={currentProject}
          activeTab="backlog"
          onTabSelect={() => {}}
        />

        <div className="content-area">
          <h2 style={{ color: "#f1f1f1" }}>Product Backlog</h2>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "12px",
            }}
          >
            <button
              className="create-sprint-btn"
              onClick={() => setShowAddBacklog(true)}
            >
              + Thêm Sprint Backlog
            </button>
          </div>

          <SprintBacklogList items={backlogs} />
        </div>
      </div>

      {showAddBacklog && (
        <AddSprintBacklog
          sprintId={realSprintId}
          onClose={() => setShowAddBacklog(false)}
          onSubmit={async ({ sprintId, title, description }) => {
            await api.post(`/sprints/${sprintId}/backlog`, {
              title,
              description,
            });
            const res = await api.get(`/projects/${sprintId}/backlogs`);
            setBacklogs(res.data.backlogs || []);
            setShowAddBacklog(false);
          }}
        />
      )}
    </div>
  );
};

export default ProductBacklogPage;
