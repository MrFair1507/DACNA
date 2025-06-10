import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Layout/Sidebar/Sidebar";
import MainHeader from "../../components/Layout/Header/MainHeader/MainHeader";
import SprintsHeader from "../../components/Layout/Header/SprintsHeader/SprintsHeader";
import api from "../../services/api";
import BacklogList from "../../components/SprintBacklog/BacklogList";
import AddSprintBacklog from "../../components/SprintBacklog/AddSprintBacklog";
import "../dashboard/DashboardPage/DashboardPage.css";
import "./ProductBacklogPage.css"; // ✅ thêm file CSS mới nếu cần
import { useNavigate } from "react-router-dom";

const ProductBacklogPage = () => {
  const { projectId } = useParams();
  const realProjectId = projectId;
  const activeProjectId = `project${projectId}`;

  const [projects, setProjects] = useState([]);
  const [backlogs, setBacklogs] = useState([]);
  const [showAddBacklog, setShowAddBacklog] = useState(false);

  const currentProject = projects.find((p) => p.id === activeProjectId);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects/my-projects", {
          withCredentials: true,
        });

        const formatted = res.data.map((p) => ({
          id: `project${p.project_id}`,
          title: p.project_name,
          description: p.project_description,
          color: p.color || "blue",
        }));

        setProjects(formatted);
      } catch (err) {
        console.error("❌ Lỗi khi lấy project:", err);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchAllBacklogs = async () => {
      try {
        const [unassignedRes, sprintsRes] = await Promise.all([
          api.get(`/projects/${realProjectId}/backlog`),
          api.get(`/sprints?project_id=${realProjectId}`),
        ]);

        const unassigned = unassignedRes.data || [];
        const sprints = sprintsRes.data.sprints || [];

        const assignedResList = await Promise.all(
          sprints.map((s) => api.get(`/sprints/${s.sprint_id}/backlog`))
        );

        const assigned = assignedResList.flatMap((res) => res.data || []);
        const allBacklogs = [...unassigned, ...assigned];

        setBacklogs(allBacklogs);
      } catch (err) {
        console.error("❌ Lỗi khi tải toàn bộ backlog:", err);
      }
    };

    if (realProjectId) {
      fetchAllBacklogs();
    }
  }, [realProjectId]);

  return (
    <div className="dashboard-container">
      <Sidebar
        projects={projects}
        activeProjectId={activeProjectId}
        activeTab="backlog"
        onProjectSelect={(id) => {
          const realId = id.replace("project", "");
          navigate(`/dashboard/${realId}/backlog`);
        }}
        onTabSelect={(id, tab) => {
          if (tab === "project") {
            window.location.href = "/dashboard";
          } else {
            window.location.href = `/dashboard/${id}/${tab}`;
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
          <div className="product-backlog-header">
            <h2 className="backlog-title">Product Backlog</h2>

            <button
              className="create-sprint-btn"
              onClick={() => setShowAddBacklog(true)}
            >
              + Tạo Product Backlog
            </button>
          </div>

          <BacklogList items={backlogs} />
        </div>
      </div>

      {showAddBacklog && realProjectId && (
        <AddSprintBacklog
          projectId={realProjectId}
          onClose={() => setShowAddBacklog(false)}
          onSubmit={async ({ projectId, title, description }) => {
            if (!projectId || projectId === "null") {
              alert("⚠️ Vui lòng chọn một dự án trước khi tạo backlog.");
              return;
            }

            try {
              await api.post(`/projects/${projectId}/backlog`, {
                title,
                description,
              });

              const res = await api.get(`/projects/${projectId}/backlog`);
              setBacklogs(res.data || []);
              setShowAddBacklog(false);
            } catch (err) {
              console.error("❌ Lỗi tạo backlog:", err);
              alert("Không thể tạo backlog.");
            }
          }}
        />
      )}
    </div>
  );
};

export default ProductBacklogPage;
