// 📁 src/pages/tasks/TaskPage.jsx
import React, { useState, useRef } from "react";
import Sidebar from "../../components/Layout/Sidebar/Sidebar";
import KanbanBoard from "../../components/Project/KanbanBoard";
import AddTaskForm from "../../components/Project/AddTaskForm";
import TaskDetailModal from "../../components/Project/TaskDetailModal";
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

  const isExpired = sprint?.end_date && new Date(sprint.end_date) < new Date();

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

  const handleTaskUpdate = (updatedTask) => {
    if (updatedTask.deleted) {
      kanbanRef.current?.handleTaskDeleteInternal?.(updatedTask.task_id);
    } else {
      kanbanRef.current?.handleTaskUpdateInternal?.(updatedTask);
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
          const base = `/dashboard/${realId}`;
          if (tab === "board") window.location.href = `${base}/sprints/${realSprintId}/tasks`;
          else if (tab === "sprints") window.location.href = `${base}/sprints`;
          else if (tab === "backlog") window.location.href = `${base}/backlog`;
          else if (tab === "reports") window.location.href = `${base}/reports`;
        }}
      />

      <div className="main-content">
        <MainHeader />
        <div className="content-area">
          <KanbanBoard
            ref={kanbanRef}
            sprintId={realSprintId}
            sprint={sprint}
            onAddTask={!isExpired ? handleAddTask : undefined}
            onTaskClick={handleTaskClick}
            onTaskMoved={() => {}}
          />
        </div>
      </div>

      {showAddTaskForm && !isExpired && (
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
          onError={(err) => console.error("❌ Lỗi tạo task:", err)}
        />
      )}

      {showTaskDetailModal && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          projectMembers={projectMembers}
          readOnly={isExpired}
          onClose={() => setShowTaskDetailModal(false)}
          onTaskUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
};

export default TaskPage;
