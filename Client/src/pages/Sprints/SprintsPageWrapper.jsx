import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ sửa dòng này
import SprintsPage from "./SprintsPage";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const SprintsPageWrapper = () => {
  const { projectId } = useParams(); // ✅ ok
  const { user } = useAuth();
  const navigate = useNavigate(); // ✅ sửa đúng tên
  const [sprints, setSprints] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const fullProjectId = `project${projectId}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sprintRes, projectRes] = await Promise.all([
          api.get(`/sprints?project_id=${projectId}`),
          api.get("/projects"),
        ]);

        const sprintList = Array.isArray(sprintRes.data)
          ? sprintRes.data
          : sprintRes.data.sprints || [];

        const formattedProjects = projectRes.data.map((p) => ({
          id: `project${p.project_id}`,
          title: p.project_name,
          description: p.project_description,
          color: p.color || "blue",
        }));

        setSprints(sprintList);
        setProjects(formattedProjects);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu Sprint/Project:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <SprintsPage
      sprints={sprints}
      onCreateSprint={() => {}}
      onSprintClick={(sprint) => {
        const sprintId = sprint.id || sprint.sprint_id; // ✅ tránh lỗi undefined
        if (sprintId) {
          navigate(`/dashboard/${projectId}/sprints/${sprintId}/tasks`);
        } else {
          console.error("Sprint không có ID:", sprint);
        }
      }}
      activeProjectId={fullProjectId}
      projects={projects}
      user={user}
    />
  );
};

export default SprintsPageWrapper;
