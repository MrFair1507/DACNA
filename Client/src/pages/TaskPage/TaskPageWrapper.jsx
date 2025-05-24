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
  const [columns, setColumns] = useState({});
  const [projectMembers, setProjectMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, sprintRes] = await Promise.all([
          api.get("/projects"),
          api.get(`/sprints?sprint_id=${sprintId}`),
        ]);

        const formattedProjects = projectsRes.data.map((p) => ({
          id: `project${p.project_id}`,
          title: p.project_name,
          description: p.project_description,
          color: p.color || "blue",
        }));

        const sprintData = Array.isArray(sprintRes.data) && sprintRes.data.length > 0
          ? sprintRes.data[0]
          : sprintRes.data;

        const defaultColumns = {
          todo: { id: "todo", title: "To Do", tasks: [] },
          inProgress: { id: "inProgress", title: "In Progress", tasks: [] },
          review: { id: "review", title: "Đang xét duyệt", tasks: [] },
          done: { id: "done", title: "Hoàn thành", tasks: [] },
        };

        if (sprintData.tasks) {
          for (let task of sprintData.tasks) {
            const status = task.status || "todo";
            if (defaultColumns[status]) {
              defaultColumns[status].tasks.push(task);
            } else {
              defaultColumns.todo.tasks.push(task);
            }
          }
        }

        setSprint(sprintData);
        setProjects(formattedProjects);
        setColumns(defaultColumns);

        // Dữ liệu giả thay vì gọi API members (vì route đó không tồn tại)
        setProjectMembers([
          { id: "u1", name: "Alice", avatar: "A" },
          { id: "u2", name: "Bob", avatar: "B" },
          { id: "u3", name: "Charlie", avatar: "C" },
        ]);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu TaskPage:", err);
      }
    };

    fetchData();
  }, [projectId, sprintId]);

  return (
    <TaskPage
      projectId={fullProjectId}
      sprint={sprint}
      columns={columns}
      user={user}
      projects={projects}
      projectMembers={projectMembers}
    />
  );
};

export default TaskPageWrapper;
