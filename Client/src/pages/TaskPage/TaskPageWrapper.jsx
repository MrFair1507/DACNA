// 📁 src/pages/tasks/TaskPageWrapper.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TaskPage from "./TaskPage";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const TaskPageWrapper = () => {
  const { projectId, sprintId } = useParams();
  const { user } = useAuth();

  const fullProjectId = `project${projectId}`;
  const [projects, setProjects] = useState([]);
  const [sprint, setSprint] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Gọi đồng thời 3 API: danh sách project, sprint hiện tại, và thành viên dự án
        const [projectsRes, sprintRes, membersRes] = await Promise.all([
          api.get("/projects/my-projects", { withCredentials: true }),
          api.get(`/sprints?sprint_id=${sprintId}`),
          api.get(`/projects/${projectId}/members`), // 🎯 Lấy danh sách thành viên dự án
        ]);

        const formattedProjects = projectsRes.data.map((p) => ({
          id: `project${p.project_id}`,
          title: p.project_name,
          description: p.project_description,
          color: p.color || "blue",
          template_type: p.template_type || "default",
        }));

        const sprintData = Array.isArray(sprintRes.data)
          ? sprintRes.data[0]
          : sprintRes.data;

        setProjects(formattedProjects);
        setSprint(sprintData);
        setProjectMembers(membersRes.data); // ✅ Gán danh sách thành viên

      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu TaskPageWrapper:", err);
      }
    };

    fetchData();
  }, [projectId, sprintId]);

  const currentProject = projects.find((p) => p.id === fullProjectId);

  return (
    <TaskPage
      projectId={fullProjectId}
      project={currentProject}
      sprint={sprint}
      sprintId={sprintId}
      user={user}
      projects={projects}
      projectMembers={projectMembers}
    />
  );
};

export default TaskPageWrapper;
