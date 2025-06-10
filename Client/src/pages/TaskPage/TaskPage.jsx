// // 📁 src/pages/tasks/TaskPage.jsx
// import React, { useState } from "react";
// import Sidebar from "../../components/Layout/Sidebar/Sidebar";
// import KanbanBoard from "../../components/Project/KanbanBoard";
// import AddTaskForm from "../../components/Project/AddTaskForm";
// import TaskDetailModal from "../../components/Project/TaskDetailModal";
// import "../dashboard/DashboardPage/DashboardPage.css";
// import MainHeader from "../../components/Layout/Header/MainHeader/MainHeader";

// const TaskPage = ({
//   project,
//   projectId,
//   sprintId,
//   sprint,
//   user,
//   projects = [],
//   projectMembers = [],
// }) => {
//   const templateType = project?.template_type || "default";

//   const getDefaultColumns = () => ({
//     uncategorized: { id: "uncategorized", title: "Chưa phân loại", tasks: [] },
//     todo: { id: "todo", title: "To Do", tasks: [] },
//     inProgress: { id: "inProgress", title: "In Progress", tasks: [] },
//     ...(templateType === "scrum"
//       ? {}
//       : { review: { id: "review", title: "Review", tasks: [] } }),
//     done: { id: "done", title: "Done", tasks: [] },
//   });

//   const [showAddTaskForm, setShowAddTaskForm] = useState(false);
//   const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [selectedColumn, setSelectedColumn] = useState(null);
//   const [taskCreatedCallback, setTaskCreatedCallback] = useState(null);
//   // const templateType = project?.template_type || "default";

//   const realProjectId = projectId?.replace("project", "");
//   const realSprintId = sprintId || sprint?.id || sprint?.sprint_id;

//   const handleAddTask = (columnId, onTaskCreatedCallback) => {
//     setSelectedColumn(columnId);
//     setTaskCreatedCallback(() => onTaskCreatedCallback);
//     setShowAddTaskForm(true);
//   };

//   const handleTaskClick = (task, columnId) => {
//     setSelectedTask(task);
//     setSelectedColumn(columnId);
//     setShowTaskDetailModal(true);
//   };

//   const handleTaskSubmit = (newTask) => {
//     if (taskCreatedCallback) taskCreatedCallback(newTask);
//     setShowAddTaskForm(false);
//     setSelectedColumn(null);
//     setTaskCreatedCallback(null);
//   };

//   const handleTaskError = (error) => {
//     console.error("❌ Lỗi tạo task:", error);
//   };

//   const handleTaskUpdate = (updatedTask) => {
//     if (updatedTask.deleted) {
//       // có thể reload
//     }
//     setShowTaskDetailModal(false);
//     setSelectedTask(null);
//     setSelectedColumn(null);
//   };
//   return (
//     <div className="dashboard-container">
//       <Sidebar
//         projects={projects}
//         activeTab="sprints"
//         activeProjectId={projectId}
//         onProjectSelect={(id) => {
//           const realId = id?.replace("project", "");
//           window.location.href = `/dashboard/${realId}/sprints`;
//         }}
//         onTabSelect={(id, tab) => {
//           const realId = id?.replace("project", "");
//           if (tab === "board") {
//             window.location.href = `/dashboard/${realId}/sprints/${realSprintId}/tasks`;
//           } else if (tab === "sprints") {
//             window.location.href = `/dashboard/${realId}/sprints`;
//           } else if (tab === "backlog") {
//             window.location.href = `/dashboard/${realId}/backlog`;
//           } else if (tab === "reports") {
//             window.location.href = `/dashboard/${realId}/reports`;
//           }
//         }}
//       />

//       <div className="main-content">
//         <MainHeader />

//         <div className="content-area">
//           <KanbanBoard
//             boardId={projectId}
//             sprintId={realSprintId}
//             projectId={realProjectId}
//             sprint={sprint}
//             onAddTask={handleAddTask}
//             onTaskClick={handleTaskClick}
//             onTaskMoved={() => {}}
//             templateType={project?.template || "default"}
//           />
//         </div>
//       </div>

//       {/* Modal thêm task */}
//       {showAddTaskForm && (
//         <AddTaskForm
//           sprintId={realSprintId}
//           projectId={realProjectId}
//           projectMembers={projectMembers}
//           initialColumnId={selectedColumn}
//           onClose={() => {
//             setShowAddTaskForm(false);
//             setSelectedColumn(null);
//             setTaskCreatedCallback(null);
//           }}
//           onSubmit={handleTaskSubmit}
//           onError={handleTaskError}
//         />
//       )}

//       {/* Modal chi tiết task */}
//       {showTaskDetailModal && selectedTask && (
//         <TaskDetailModal
//           task={selectedTask}
//           projectMembers={projectMembers}
//           onClose={() => setShowTaskDetailModal(false)}
//           onTaskUpdate={handleTaskUpdate}
//         />
//       )}
//     </div>
//   );
// };

// export default TaskPage;
// 📁 src/pages/tasks/TaskPage.jsx
import React, { useState } from "react";
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
      // TODO: reload danh sách task nếu cần
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
      />

      <div className="main-content">
        <MainHeader />
        <div className="content-area">
          <KanbanBoard
            boardId={projectId}
            sprintId={realSprintId}
            projectId={realProjectId}
            sprint={sprint}
            onAddTask={handleAddTask}
            onTaskClick={handleTaskClick}
            onTaskMoved={() => {}}
            templateType={project?.template_type || "default"} // ✅ Sửa lại đúng field
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
