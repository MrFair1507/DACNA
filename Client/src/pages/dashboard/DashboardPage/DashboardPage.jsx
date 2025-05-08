import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import "./DashboardPage.css";

import Sidebar from "../../../components/Layout/Sidebar/Sidebar";
import Header from "../../../components/Layout/Header/Header";

import KanbanBoard from "../../../components/Project/KanbanBoard";
import ProjectList from "../../../components/Project/ProjectList/ProjectList";
import CreateProjectForm from "../../../components/UI/CreateProjectForm/CreateProjectForm";

import AddTaskForm from "../../../components/Project/AddTaskForm";
import TaskDetailModal from "../../../components/Project/TaskDetailModal";
import SprintsList from "../../../components/Sprints/SprintsList";
import CreateSprintForm from "../../../components/Sprints/CreateSprintForm";

// import axios from "axios";
import api from "../../../services/api";

const DashboardPage = () => {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString("vi-VN");

  // Trạng thái chính của dashboard
  const [activeView, setActiveView] = useState("projectList");
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeTab, setActiveTab] = useState("project");
  const [activeSprint, setActiveSprint] = useState(null);

  // Dữ liệu project và tasks
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects", {
          withCredentials: true, // nếu có sử dụng cookie
        });

        // Chuyển đổi dữ liệu từ backend sang định dạng phù hợp
        const formatted = response.data.map((p) => ({
          id: `project${p.project_id}`,
          title: p.project_name,
          description: p.project_description,
          color: "blue", // gán tạm nếu chưa có
          owner: `User ${p.created_by}`, // sau này thay bằng tên thật
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

  const [projectMembers, setProjectMembers] = useState({
    project1: [
      {
        id: "u1",
        name: "Minh Huynh",
        role: "Admin",
        avatar: "M",
        lastActive: "21/04/2025",
      },
      {
        id: "u2",
        name: "Dang Ho",
        role: "Member",
        avatar: "D",
        lastActive: "20/04/2025",
      },
      {
        id: "u3",
        name: "Tri Vu",
        role: "Member",
        avatar: "T",
        lastActive: "19/04/2025",
      },
    ],
    project2: [
      {
        id: "u1",
        name: "Minh Huynh",
        role: "Member",
        avatar: "M",
        lastActive: "21/04/2025",
      },
      {
        id: "u4",
        name: "Khoa Nguyen",
        role: "Admin",
        avatar: "K",
        lastActive: "18/04/2025",
      },
    ],
    project3: [
      {
        id: "u5",
        name: "Dat Chau",
        role: "Admin",
        avatar: "D",
        lastActive: "20/04/2025",
      },
      {
        id: "u3",
        name: "Tri Vu",
        role: "Member",
        avatar: "T",
        lastActive: "19/04/2025",
      },
    ],
  });

  const [availableUsers] = useState([
    { id: "u1", name: "Minh Huynh", email: "minh@example.com", avatar: "M" },
    { id: "u2", name: "Dang Ho", email: "dang@example.com", avatar: "D" },
    { id: "u3", name: "Tri Vu", email: "tri@example.com", avatar: "T" },
    { id: "u4", name: "Khoa Nguyen", email: "khoa@example.com", avatar: "K" },
    { id: "u5", name: "Dat Chau", email: "dat@example.com", avatar: "D" },
    { id: "u6", name: "Kien Vo", email: "kien@example.com", avatar: "K" },
  ]);

  const defaultTemplates = {
    default: {
      backlog: { id: "backlog", title: "Backlog", tasks: [] },
      todo: { id: "todo", title: "To Do", tasks: [] },
      inProgress: { id: "inProgress", title: "In Progress", tasks: [] },
      review: { id: "review", title: "Đang xét duyệt", tasks: [] },
      done: { id: "done", title: "Hoàn thành", tasks: [] },
    },
    kanban: {
      todo: { id: "todo", title: "To Do", tasks: [] },
      inProgress: { id: "inProgress", title: "In Progress", tasks: [] },
      done: { id: "done", title: "Done", tasks: [] },
    },
    scrum: {
      backlog: { id: "backlog", title: "Backlog", tasks: [] },
      sprint: { id: "sprint", title: "Sprint", tasks: [] },
      review: { id: "review", title: "Review", tasks: [] },
      done: { id: "done", title: "Done", tasks: [] },
    },
    project: {
      planning: { id: "planning", title: "Lên kế hoạch", tasks: [] },
      execution: { id: "execution", title: "Thực hiện", tasks: [] },
      monitoring: { id: "monitoring", title: "Giám sát", tasks: [] },
      closing: { id: "closing", title: "Kết thúc", tasks: [] },
    },
  };

  // Dữ liệu tasks chia theo projectId
  const [projectTasks, setProjectTasks] = useState({
    project1: JSON.parse(JSON.stringify(defaultTemplates.default)),
    project2: JSON.parse(JSON.stringify(defaultTemplates.default)),
    project3: JSON.parse(JSON.stringify(defaultTemplates.default)),
  });

  // Dữ liệu sprints
  const [sprints, setSprints] = useState({});

  // Trạng thái cho các popup/modal
  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false);
  // const [showAddMembersForm, setShowAddMembersForm] = useState(false);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [showCreateSprintForm, setShowCreateSprintForm] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  // eslint-disable-next-line
  const [justCreatedProjectId, setJustCreatedProjectId] = useState(null);

  useEffect(() => {
    console.log("Projects hiện tại:", projects);
  }, [projects]);

  useEffect(() => {
    console.log("Project tasks hiện tại:", projectTasks);
  }, [projectTasks]);

  useEffect(() => {
    console.log("Sprints hiện tại:", sprints);
  }, [sprints]);
  useEffect(() => {
    if (justCreatedProjectId) {
      console.log(
        "⏩ Auto chuyển tab Sprints cho project mới:",
        justCreatedProjectId
      );
      handleTabSelect(justCreatedProjectId, "sprints");
      setJustCreatedProjectId(null);
    }
    // eslint-disable-next-line
  }, [justCreatedProjectId]);
  // Chọn project
  const handleProjectSelect = async (projectId) => {
    if (projectId) {
      await handleTabSelect(projectId, "sprints");
      setActiveProjectId(projectId);
      setActiveView("sprints");
      setActiveTab("sprints");
      setActiveSprint(null);
    } else {
      setActiveView("projectList");
      setActiveProjectId(null);
      setActiveSprint(null);
    }
  };

  const handleTabSelect = async (projectId, tab) => {
    setActiveProjectId(projectId);
    setActiveTab(tab);

    if (tab === "sprints") {
      setActiveView("sprints");
      setActiveSprint(null);

      const realProjectId = Number(projectId.replace("project", ""));
      try {
        const response = await api.get(`/sprints?project_id=${realProjectId}`);
        console.log("🧩 Dữ liệu trả về từ API:", response.data);

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

        const newKey = `project${realProjectId}`;
        setSprints((prev) => {
          const updated = {
            ...prev,
            [newKey]: mapped,
          };
          console.log("✅ Đã cập nhật sprints:", updated);
          console.log("👉 Kiểm tra key:", newKey, "=", updated[newKey]);
          return updated;
        });
      } catch (error) {
        console.error(
          "❌ Lỗi khi gọi API:",
          error.response?.data || error.message
        );
      }
    }
  };

  // Tạo cột theo template
  const createColumnsFromTemplate = (templateType) => {
    const validTemplate = ["default", "kanban", "scrum", "project"].includes(
      templateType
    )
      ? templateType
      : "default";
    return JSON.parse(JSON.stringify(defaultTemplates[validTemplate]));
  };
  // Mở form tạo project
  const handleCreateProject = () => {
    setShowCreateProjectForm(true);
  };

  const handleProjectCreated = (projectData) => {
    const newProjectId = `project${projectData.project_id}`;
    const templateType = projectData.templateType;

    const newProject = {
      id: newProjectId,
      title: projectData.title,
      color: projectData.color,
      description: projectData.description,
      owner: `${user?.firstName || "Người"} ${user?.lastName || "dùng"}`,
      members: projectData.members?.length || 1,
      template: templateType,
      lastModified: currentDate,
    };

    setProjects((prev) => [...prev, newProject]);

    setProjectTasks((prev) => ({
      ...prev,
      [newProjectId]: createColumnsFromTemplate(templateType),
    }));

    setSprints((prev) => ({ ...prev, [newProjectId]: [] }));

    setProjectMembers((prev) => ({
      ...prev,
      [newProjectId]: [
        {
          id: user?.id || "current",
          name: `${user?.firstName || "Người"} ${user?.lastName || "dùng"}`,
          role: "Admin",
          avatar: `${(user?.firstName || "N")[0]}${(user?.lastName || "T")[0]}`,
          lastActive: currentDate,
        },
        ...(projectData.members || []).map((m) => ({
          id: m.id,
          name: m.name,
          role: "Member",
          avatar: m.avatar || m.name[0],
          lastActive: currentDate,
        })),
      ],
    }));

    setShowCreateProjectForm(false);
    setJustCreatedProjectId(newProjectId); // 🔁 Auto-trigger chuyển tab

    // Optional: gọi liền (tránh phải đợi useEffect)
    handleTabSelect(newProjectId, "sprints");
  };

  // Mở form tạo sprint
  const handleCreateSprint = () => {
    setShowCreateSprintForm(true);
  };

  const handleSprintCreated = async (sprintData) => {
    if (!activeProjectId) return;
    const realProjectId = Number(activeProjectId.replace("project", ""));
    const formatDate = (dateString) => {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    };
    const fullSprintData = {
      project_id: realProjectId,
      name: sprintData.name,
      description: sprintData.description,
      start_date: formatDate(sprintData.startDate),
      end_date: formatDate(sprintData.endDate),
      color: sprintData.color,
    };

    try {
      await api.post("/sprints", fullSprintData, { withCredentials: true });

      const fetchResponse = await api.get(
        `/sprints?project_id=${realProjectId}`
      );

      const mappedSprints = fetchResponse.data.sprints.map((s) => ({
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
        [`project${realProjectId}`]: mappedSprints,
      }));

      setShowCreateSprintForm(false);
    } catch (error) {
      console.error(
        "❌ Lỗi khi tạo hoặc load sprint:",
        error.response?.data || error.message
      );
    }
  };

  // Mở form tạo task
  const handleAddTask = (columnId) => {
    setSelectedColumn(columnId);
    setShowAddTaskForm(true);
  };

  // Task được thêm thành công
  const handleTaskAdded = (taskData) => {
    if (!activeProjectId || !selectedColumn || !activeSprint) return;

    const newTask = {
      id: `t${Date.now()}`,
      content: taskData.title,
      priority: taskData.priority,
      assignee: taskData.assignee,
      assigneeId: taskData.assigneeId,
      assigneeInitial: taskData.assignee ? taskData.assignee[0] : "",
      dueDate: taskData.dueDate,
      description: taskData.description,
    };

    setProjectTasks((prev) => {
      const updated = { ...prev[activeProjectId] };
      updated[selectedColumn].tasks.push(newTask);
      return {
        ...prev,
        [activeProjectId]: updated,
      };
    });

    setShowAddTaskForm(false);
    setSelectedColumn(null);
  };
  // 🔹 Phần 7
  // Khi click vào một task
  const handleTaskClick = (task, columnId) => {
    setSelectedTask(task);
    setSelectedColumn(columnId);
    setShowTaskDetailModal(true);
  };

  // Cập nhật task
  const handleTaskUpdated = (updatedTask) => {
    if (!activeProjectId || !selectedColumn) return;

    setProjectTasks((prev) => {
      const updated = { ...prev[activeProjectId] };

      if (updatedTask.deleted) {
        updated[selectedColumn].tasks = updated[selectedColumn].tasks.filter(
          (t) => t.id !== updatedTask.id
        );
      } else {
        const index = updated[selectedColumn].tasks.findIndex(
          (t) => t.id === updatedTask.id
        );
        if (index !== -1) {
          updated[selectedColumn].tasks[index] = updatedTask;
        }
      }

      return {
        ...prev,
        [activeProjectId]: updated,
      };
    });

    setShowTaskDetailModal(false);
    setSelectedTask(null);
    setSelectedColumn(null);
  };

  // Di chuyển task giữa các cột
  const handleTaskMoved = (taskId, sourceColumnId, targetColumnId) => {
    if (!activeProjectId) return;

    setProjectTasks((prev) => {
      const updated = { ...prev[activeProjectId] };
      const source = updated[sourceColumnId];
      const taskIndex = source.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return prev;

      const task = source.tasks[taskIndex];
      source.tasks.splice(taskIndex, 1);
      updated[targetColumnId].tasks.push(task);

      return {
        ...prev,
        [activeProjectId]: updated,
      };
    });
  };

  // Khi chọn một sprint
  const handleSprintClick = (sprint) => {
    setActiveSprint(sprint);
    setActiveView("kanban");
    console.log("Đã chọn sprint:", sprint);
  };
  // Hiển thị nội dung chính dựa vào activeView
  const renderContent = () => {
    console.log("🔎 renderContent - activeProjectId:", activeProjectId);
    console.log("🔎 renderContent - sprints keys:", Object.keys(sprints));
    console.log(
      "🔎 renderContent - sprints[activeProjectId]:",
      sprints[activeProjectId]
    );

    switch (activeView) {
      case "projectList":
        return (
          <ProjectList
            projects={projects}
            onProjectSelect={handleProjectSelect}
            onCreateProject={handleCreateProject}
          />
        );
      case "kanban":
        return (
          <KanbanBoard
            projectId={activeProjectId}
            columns={projectTasks[activeProjectId] || {}}
            sprint={activeSprint}
            onAddTask={handleAddTask}
            onTaskClick={handleTaskClick}
            onTaskMoved={handleTaskMoved}
          />
        );
      case "sprints":
        return (
          <SprintsList
            sprints={sprints[activeProjectId] || []}
            onCreateSprint={handleCreateSprint}
            onSprintClick={handleSprintClick}
            activeProjectId={activeProjectId}
          />
        );

      case "backlog":
        return (
          <div className="placeholder-view">
            <div className="placeholder-icon">📋</div>
            <h3>Tính năng Backlog đang phát triển</h3>
            <p>
              Chức năng này đang được xây dựng và sẽ sớm ra mắt. Bạn sẽ có thể
              quản lý các task trong backlog, sắp xếp ưu tiên và chuẩn bị cho
              sprint.
            </p>
          </div>
        );
      case "reports":
        return (
          <div className="placeholder-view">
            <div className="placeholder-icon">📊</div>
            <h3>Tính năng Reports đang phát triển</h3>
            <p>
              Bạn sẽ có thể xem các báo cáo, biểu đồ phân tích và thống kê về
              tiến độ dự án.
            </p>
          </div>
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

  const renderBackButton = () => {
    if (activeView === "kanban" && activeSprint) {
      return (
        <button
          className="back-to-sprints"
          onClick={() => {
            setActiveView("sprints");
            setActiveSprint(null);
          }}
        >
          ← Quay lại danh sách Sprints
        </button>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        projects={projects} // ✅ truyền props mới
        activeTab={activeTab}
        activeProjectId={activeProjectId}
        onProjectSelect={handleProjectSelect}
        onTabSelect={handleTabSelect}
      />

      <div className="main-content">
        <Header
          user={user}
          activeView={activeView}
          activeTab={activeTab}
          activeProjectId={activeProjectId}
          activeSprint={activeSprint}
          project={projects.find((p) => p.id === activeProjectId)}
          onTabSelect={handleTabSelect}
          // onAddMembers={activeProjectId ? handleAddMembers : null}
        />

        <div className="content-area">
          {renderBackButton()}
          {renderContent()}
        </div>
      </div>

      {showCreateProjectForm && (
        <CreateProjectForm
          onClose={() => setShowCreateProjectForm(false)}
          onProjectCreated={handleProjectCreated}
          availableUsers={availableUsers}
          currentUserId={user?.user_id} // bạn có thể đặt tên khác nếu cần
        />
      )}

      {showAddTaskForm && (
        <AddTaskForm
          projectMembers={projectMembers[activeProjectId] || []}
          onClose={() => setShowAddTaskForm(false)}
          onSubmit={handleTaskAdded}
        />
      )}

      {showTaskDetailModal && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          projectMembers={projectMembers[activeProjectId] || []}
          onClose={() => setShowTaskDetailModal(false)}
          onTaskUpdate={handleTaskUpdated}
        />
      )}

      {showCreateSprintForm && (
        <CreateSprintForm
          onClose={() => setShowCreateSprintForm(false)}
          onSubmit={handleSprintCreated}
        />
      )}
    </div>
  );
};

export default DashboardPage;
