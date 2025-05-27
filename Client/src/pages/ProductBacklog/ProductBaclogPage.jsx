import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Layout/Sidebar/Sidebar";
import MainHeader from "../../components/Layout/Header/MainHeader/MainHeader";
import SprintsHeader from "../../components/Layout/Header/SprintsHeader/SprintsHeader";
import api from "../../services/api";
import BacklogList from "../../components/SprintBacklog/BacklogList";
import AddSprintBacklog from "../../components/SprintBacklog/AddSprintBacklog";
import "../dashboard/DashboardPage/DashboardPage.css";

const ProductBacklogPage = () => {
  const [projects, setProjects] = useState([]);
  const [backlogs, setBacklogs] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [showAddBacklog, setShowAddBacklog] = useState(false);

  // ✅ realProjectId luôn đúng theo activeProjectId
  const realProjectId = useMemo(() => {
    return activeProjectId ? activeProjectId.replace("project", "") : null;
  }, [activeProjectId]);

  const currentProject = projects.find((p) => p.id === activeProjectId);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        const formatted = res.data.map((p) => ({
          id: `project${p.project_id}`,
          title: p.project_name,
          description: p.project_description,
          color: p.color || "blue",
        }));
        setProjects(formatted);

        // ✅ Nếu không có project đang chọn, chọn project đầu tiên
        if (!activeProjectId && formatted.length > 0) {
          setActiveProjectId(formatted[0].id);
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy project:", err);
      }
    };
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
  const fetchAllBacklogs = async () => {
    try {
      // 1. Lấy backlog chưa gán sprint
      const [unassignedRes, sprintsRes] = await Promise.all([
        api.get(`/projects/${realProjectId}/backlog`),
        api.get(`/sprints?project_id=${realProjectId}`)
      ]);

      const unassigned = unassignedRes.data || [];
      const sprints = sprintsRes.data.sprints || [];

      // 2. Lấy backlog đã gán từ từng sprint
      const assignedResList = await Promise.all(
        sprints.map((s) => api.get(`/sprints/${s.sprint_id}/backlog`))
      );

      const assigned = assignedResList.flatMap((res) => res.data || []);

      // 3. Gộp cả hai lại
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
