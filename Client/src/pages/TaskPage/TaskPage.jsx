// 📁 src/pages/tasks/TaskPage.jsx
import React, { useState, useRef } from "react";
import Sidebar from "../../components/Layout/Sidebar/Sidebar";
import KanbanBoard from "../../components/Project/KanbanBoard";
import AddTaskForm from "../../components/Project/AddTaskForm";
import TaskDetailModal from "../../components/Project/TaskDetailModal";
import "../dashboard/DashboardPage/DashboardPage.css";
import MainHeader from "../../components/Layout/Header/MainHeader/MainHeader";

const TaskPage = ({
  project,
  projectId,
  sprintId,
  sprint,
  user,
  projects = [],
  projectMembers = [],
}) => {
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [taskCreatedCallback, setTaskCreatedCallback] = useState(null);

  const realProjectId = projectId?.replace("project", "");
  const realSprintId = sprintId || sprint?.id || sprint?.sprint_id;
  const templateType = project?.template_type || "default";

  // ✅ Ref để gọi method từ KanbanBoard
  const kanbanRef = useRef(null);

  const handleAddTask = (columnId, onTaskCreatedCallback) => {
    setSelectedColumn(columnId);
    setTaskCreatedCallback(() => onTaskCreatedCallback);
    setShowAddTaskForm(true);
  };

  const handleTaskClick = (task, columnId) => {
    setSelectedTask(task);
    setSelectedColumn(columnId);
    setShowTaskDetailModal(true);
  };

  const handleTaskSubmit = (newTask) => {
    if (taskCreatedCallback) taskCreatedCallback(newTask);
    setShowAddTaskForm(false);
    setSelectedColumn(null);
    setTaskCreatedCallback(null);
  };

  const handleTaskError = (error) => {
    console.error("❌ Lỗi tạo task:", error);
  };

  const handleTaskUpdate = (updatedTask) => {
    if (updatedTask.deleted) {
      // Nếu đã xoá → reload nếu cần
      return;
    }

    if (kanbanRef.current?.handleTaskUpdateInternal) {
      kanbanRef.current.handleTaskUpdateInternal(updatedTask);
    }

    setShowTaskDetailModal(false);
    setSelectedTask(null);
    setSelectedColumn(null);
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        projects={projects}
        activeTab="sprints"
        activeProjectId={projectId}
        onProjectSelect={(id) => {
          const realId = id?.replace("project", "");
          window.location.href = `/dashboard/${realId}/sprints`;
        }}
        showMemberMenu={true}
        onTabSelect={(id, tab) => {
          const realId = id?.replace("project", "");
          if (tab === "board") {
            window.location.href = `/dashboard/${realId}/sprints/${realSprintId}/tasks`;
          } else if (tab === "sprints") {
            window.location.href = `/dashboard/${realId}/sprints`;
          } else if (tab === "backlog") {
            window.location.href = `/dashboard/${realId}/backlog`;
          } else if (tab === "reports") {
            window.location.href = `/dashboard/${realId}/reports`;
          }
        }}
      />

      <div className="main-content">
        <MainHeader />
        <div className="content-area">
          <KanbanBoard
            ref={kanbanRef}
            boardId={projectId}
            sprintId={realSprintId}
            projectId={realProjectId}
            sprint={sprint}
            onAddTask={handleAddTask}
            onTaskClick={handleTaskClick}
            onTaskMoved={() => {}}
            templateType={templateType}
          />
        </div>
      </div>

      {showAddTaskForm && (
        <AddTaskForm
          sprintId={realSprintId}
          projectId={realProjectId}
          projectMembers={projectMembers}
          initialColumnId={selectedColumn}
          onClose={() => {
            setShowAddTaskForm(false);
            setSelectedColumn(null);
            setTaskCreatedCallback(null);
          }}
          onSubmit={handleTaskSubmit}
          onError={handleTaskError}
        />
      )}

      {showTaskDetailModal && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          projectMembers={projectMembers}
          onClose={() => setShowTaskDetailModal(false)}
          onTaskUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
};

export default TaskPage;
