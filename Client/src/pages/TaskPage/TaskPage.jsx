// 📁 src/pages/tasks/TaskPage.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Layout/Sidebar/Sidebar";
// import Header from "../../components/Layout/Header/Header";
import KanbanBoard from "../../components/Project/KanbanBoard";
import AddTaskForm from "../../components/Project/AddTaskForm";
import TaskDetailModal from "../../components/Project/TaskDetailModal";
import "../dashboard/DashboardPage/DashboardPage.css";
import MainHeader from "../../components/Layout/Header/MainHeader/MainHeader";

const TaskPage = ({
  projectId,
  sprint,
  columns,
  user,
  projects = [],
  projectMembers = [],
}) => {
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [taskColumns, setTaskColumns] = useState(columns);

  useEffect(() => {
    setTaskColumns(columns);
  }, [columns]);

  const handleAddTask = (columnId) => {
    setSelectedColumn(columnId);
    setShowAddTaskForm(true);
  };

  const handleTaskClick = (task, columnId) => {
    setSelectedTask(task);
    setSelectedColumn(columnId);
    setShowTaskDetailModal(true);
  };

  const handleTaskSubmit = (taskData) => {
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

    const updated = { ...taskColumns };
    updated[selectedColumn].tasks.push(newTask);
    setTaskColumns(updated);

    setShowAddTaskForm(false);
    setSelectedColumn(null);
  };

  const handleTaskUpdate = (updatedTask) => {
    const updated = { ...taskColumns };

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

    setTaskColumns(updated);
    setShowTaskDetailModal(false);
    setSelectedTask(null);
    setSelectedColumn(null);
  };

  const handleTaskMoved = (taskId, sourceColumnId, targetColumnId) => {
    const updated = { ...taskColumns };
    const source = updated[sourceColumnId];
    const taskIndex = source.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;

    const task = source.tasks[taskIndex];
    source.tasks.splice(taskIndex, 1);
    updated[targetColumnId].tasks.push(task);
    setTaskColumns(updated);
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        projects={projects}
        activeTab="sprints"
        activeProjectId={projectId}
        onProjectSelect={(id) => {
          if (!id) {
            window.location.href = "/dashboard";
          } else {
            const realId = id?.replace("project", "");
            window.location.href = `/dashboard/${realId}/sprints`;
          }
        }}
        onTabSelect={(id, tab) => {
          if (tab === "project") {
            window.location.href = "/dashboard";
          } else if (tab === "board") {
            window.location.href = `/dashboard/${id}/sprints/${id}/tasks`;
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

        <div className="content-area">
          <KanbanBoard
            boardId={projectId}
            columns={taskColumns}
            sprint={sprint}
            onAddTask={handleAddTask}
            onTaskClick={handleTaskClick}
            onTaskMoved={handleTaskMoved}
          />
        </div>
      </div>

      {showAddTaskForm && (
        <AddTaskForm
          projectMembers={projectMembers}
          onClose={() => setShowAddTaskForm(false)}
          onSubmit={handleTaskSubmit}
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
