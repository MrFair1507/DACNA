import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import "./DashboardPage.css";

import Sidebar from "../../../components/Layout/Sidebar/Sidebar";
import Header from "../../../components/Layout/Header/Header";

import KanbanBoard from "../../../components/Project/KanbanBoard";
import ProjectList from "../../../components/Project/ProjectList/ProjectList";
import CreateProjectForm from "../../../components/UI/CreateProjectForm/CreateProjectForm";
// import AddMembersForm from "../../../components/UI/AddMembersForm/AddMembersForm";
// import AddTaskForm from "../../../components/Project/AddTaskForm";
// import TaskDetailModal from "../../../components/Project/TaskDetailModal";
import AddTaskForm from "../../../components/Project/AddTaskForm";
import TaskDetailModal from "../../../components/Project/TaskDetailModal";
import SprintsList from "../../../components/Sprints/SprintsList";
import CreateSprintForm from "../../../components/Sprints/CreateSprintForm";

const DashboardPage = () => {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString("vi-VN");

  // Trạng thái chính của dashboard
  const [activeView, setActiveView] = useState("projectList");
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [activeTab, setActiveTab] = useState("project");
  const [activeSprint, setActiveSprint] = useState(null);

  // Dữ liệu project và tasks
  const [projects, setProjects] = useState([
    {
      id: "project1",
      title: "Dự án chính",
      color: "purple",
      description: "Phát triển ứng dụng quản lý công việc",
      owner: "Team Dev",
      members: 8,
      template: "default",
      lastModified: "21/04/2025",
    },
    {
      id: "project2",
      title: "Marketing",
      color: "green",
      description: "Chiến dịch quảng cáo Q2 2025",
      owner: "Marketing Team",
      members: 5,
      template: "default",
      lastModified: "19/04/2025",
    },
    {
      id: "project3",
      title: "Design System",
      color: "blue",
      description: "UI/UX components và guidelines",
      owner: "Design Team",
      members: 3,
      template: "default",
      lastModified: "18/04/2025",
    },
  ]);

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
  const [sprints, setSprints] = useState({
    project1: [],
    project2: [],
    project3: [],
  });

  // Trạng thái cho các popup/modal
  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false);
  // const [showAddMembersForm, setShowAddMembersForm] = useState(false);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [showCreateSprintForm, setShowCreateSprintForm] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    console.log("Projects hiện tại:", projects);
  }, [projects]);

  useEffect(() => {
    console.log("Project tasks hiện tại:", projectTasks);
  }, [projectTasks]);

  useEffect(() => {
    console.log("Sprints hiện tại:", sprints);
  }, [sprints]);

  // Chọn project
  const handleProjectSelect = (projectId) => {
    if (projectId) {
      setActiveProjectId(projectId);
      setActiveView("sprints");
      setActiveTab("sprints");
      setActiveSprint(null);
      console.log("Đã chọn project:", projectId);
    } else {
      setActiveView("projectList");
      setActiveProjectId(null);
      setActiveSprint(null);
      console.log("Quay lại danh sách project");
    }
  };

  // Chọn tab
  const handleTabSelect = (projectId, tab) => {
    setActiveProjectId(projectId);
    setActiveTab(tab);

    if (tab === "projects") {
      setActiveView("projectList");
      setActiveProjectId(null); // nếu cần quay về danh sách tổng
    } else if (tab === "sprints") {
      setActiveView("sprints");
      setActiveSprint(null);
    } else if (tab === "backlog") {
      setActiveView("backlog");
      setActiveSprint(null);
    } else if (tab === "reports") {
      setActiveView("reports");
      setActiveSprint(null);
    }

    console.log(`Đã chuyển sang tab ${tab} của project ${projectId}`);
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

  // Tạo project thành công
  // const handleProjectCreated = (projectData) => {
  //   const newProjectId = `project${Date.now()}`;
  //   const templateType = projectData.templateType;

  //   const newProject = {
  //     id: newProjectId,
  //     title: projectData.title,
  //     color: projectData.color,
  //     description: projectData.description,
  //     owner: `${user?.firstName || "Người"} ${user?.lastName || "dùng"}`,
  //     members: 1,
  //     template: templateType,
  //     lastModified: currentDate,
  //   };
  const handleProjectCreated = (projectData) => {
    const newProjectId = `project${Date.now()}`;
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
    setTimeout(() => {
      handleProjectSelect(newProjectId);
    }, 100);
  };
  

    
  // Mở form tạo sprint
  const handleCreateSprint = () => {
    setShowCreateSprintForm(true);
  };

  // Sprint được tạo thành công
  const handleSprintCreated = (sprintData) => {
    if (!activeProjectId) return;

    const newSprintId = `sprint${Date.now()}`;
    const newSprint = {
      id: newSprintId,
      name: sprintData.name,
      description: sprintData.description,
      status: "planned",
      startDate: sprintData.startDate,
      endDate: sprintData.endDate,
      totalTasks: 0,
      completedTasks: 0,
      progress: 0,
    };

    setSprints((prev) => ({
      ...prev,
      [activeProjectId]: [...(prev[activeProjectId] || []), newSprint],
    }));

    setShowCreateSprintForm(false);
    console.log("Sprint mới đã được tạo:", newSprint);
  };
  // 🔹 Phần 6
  // Mở form thêm thành viên
  // const handleAddMembers = () => {
  //   setShowAddMembersForm(true);
  // };

  // Thêm thành viên thành công
  // const handleMembersAdded = (newMembers, method) => {
  //   if (!activeProjectId) return;

  //   setProjectMembers((prevMembers) => {
  //     const currentMembers = prevMembers[activeProjectId] || [];
  //     const existingIds = currentMembers.map((m) => m.id);
  //     let updated = [...currentMembers];

  //     if (method === "email") {
  //       console.log(
  //         "Mời qua email:",
  //         newMembers.map((m) => m.email).join(", ")
  //       );
  //     } else if (method === "users") {
  //       const toAdd = newMembers
  //         .filter((u) => !existingIds.includes(u.id))
  //         .map((u) => ({
  //           id: u.id,
  //           name: u.name,
  //           avatar: u.avatar,
  //           role: "Member",
  //           lastActive: currentDate,
  //         }));
  //       if (toAdd.length > 0) updated = [...updated, ...toAdd];
  //     } else if (method === "team") {
  //       console.log("Đã thêm cả team:", newMembers.teamName);
  //     }

  //     return {
  //       ...prevMembers,
  //       [activeProjectId]: updated,
  //     };
  //   });

  //   setShowAddMembersForm(false);
  // };

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
        activeTab={activeTab}
        activeProjectId={activeProjectId}
        onProjectSelect={handleProjectSelect}
        onTabSelect={handleTabSelect}
        onCreateProject={handleCreateProject}
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
        />
      )}

      {/* {showAddMembersForm && (
        <AddMembersForm
          projectId={activeProjectId}
          currentMembers={projectMembers[activeProjectId] || []}
          availableUsers={availableUsers}
          onClose={() => setShowAddMembersForm(false)}
          onAddMembers={handleMembersAdded}
        />
      )} */}

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
