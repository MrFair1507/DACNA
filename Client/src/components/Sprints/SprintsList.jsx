// // src/components/Sprints/SprintsList.jsx
// import React, { useEffect } from "react";
// import "./SprintsList.css";

// const SprintsList = ({
//   sprints,
//   onCreateSprint,
//   onSprintClick,
//   activeProjectId,
// }) => {
//   const getStatusClass = (status) => {
//     switch (status) {
//       case "completed":
//         return "status-completed";
//       case "active":
//         return "status-active";
//       case "planned":
//         return "status-planned";
//       default:
//         return "";
//     }
//   };

//   const getStatusText = (status) => {
//     switch (status) {
//       case "completed":
//         return "Hoàn thành";
//       case "active":
//         return "Đang tiến hành";
//       case "planned":
//         return "Đã lên kế hoạch";
//       default:
//         return "";
//     }
//   };

//   useEffect(() => {
//     console.log("👉 Sprint props:", sprints);
//     console.log("🧪 activeProjectId:", activeProjectId);
//     console.log("🧵 Sprints truyền vào SprintsList:", sprints?.length);
//   }, [sprints, activeProjectId]);

//   return (
//     <div className="sprints-container">
//       <div className="sprints-header">
//         <h2>{activeProjectId ? "Sprints của dự án" : "Tất cả các Sprints"}</h2>
//         <button className="create-sprint-btn" onClick={onCreateSprint}>
//           <span className="btn-icon">+</span>
//           <span>Tạo Sprint mới</span>
//         </button>
//       </div>

//       <div className="sprints-list">
//         {sprints.length > 0 ? (
//           sprints.map((sprint) => (
//             <div
//               key={sprint.id}
//               className={`sprint-card ${getStatusClass(sprint.status)}`}
//               onClick={() => onSprintClick(sprint)}
//             >
//               <div className="sprint-header">
//                 <h3 className="sprint-name">{sprint.name}</h3>
//                 <span
//                   className={`sprint-status ${getStatusClass(sprint.status)}`}
//                 >
//                   {getStatusText(sprint.status)}
//                 </span>
//               </div>

//               <div className="sprint-dates">
//                 <div className="date-group">
//                   <label>Bắt đầu</label>
//                   <span>{sprint.startDate}</span>
//                 </div>
//                 <div className="date-group">
//                   <label>Kết thúc</label>
//                   <span>{sprint.endDate}</span>
//                 </div>
//               </div>

//               <div className="sprint-progress">
//                 <div className="progress-info">
//                   <span>Tiến độ</span>
//                   <span>{sprint.progress}%</span>
//                 </div>
//                 <div className="progress-bar">
//                   <div
//                     className="progress-fill"
//                     style={{ width: `${sprint.progress}%` }}
//                   ></div>
//                 </div>
//               </div>

//               <div className="sprint-stats">
//                 <div className="stats-item">
//                   <span className="stats-label">Tổng số task</span>
//                   <span className="stats-value">{sprint.totalTasks || 0}</span>
//                 </div>
//                 <div className="stats-item">
//                   <span className="stats-label">Đã hoàn thành</span>
//                   <span className="stats-value">
//                     {sprint.completedTasks || 0}
//                   </span>
//                 </div>
//               </div>

//               <div className="sprint-actions">
//                 <button
//                   className="view-sprint-btn"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onSprintClick(sprint);
//                   }}
//                 >
//                   Xem chi tiết
//                 </button>
//                 {sprint.status === "active" && (
//                   <button
//                     className="complete-sprint-btn"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       console.log(
//                         "👉 Chức năng kết thúc sprint đang chờ thêm logic"
//                       );
//                     }}
//                   >
//                     Kết thúc Sprint
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="empty-sprints">
//             <p>
//               Chưa có sprint nào. Hãy tạo sprint đầu tiên để bắt đầu quản lý
//               công việc.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SprintsList;
import React, { useEffect, useState } from "react";
import "./SprintsList.css";
import CreateSprintBacklogForm from "./CreateSprintBacklogForm";

// Fake data mô phỏng product backlog
const mockProductBacklogs = [
  { id: "pb1", title: "Đăng ký người dùng", description: "Xây dựng chức năng đăng ký tài khoản" },
  { id: "pb2", title: "Đăng nhập", description: "Xác thực tài khoản và phân quyền" },
  { id: "pb3", title: "Giao diện Kanban", description: "Hiển thị các cột và nhiệm vụ" },
];

const SprintsList = ({
  sprints,
  onCreateSprint,
  onSprintClick,
  activeProjectId,
}) => {
  const [showBacklogForm, setShowBacklogForm] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState(null);

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "status-completed";
      case "active":
        return "status-active";
      case "planned":
        return "status-planned";
      default:
        return "";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "active":
        return "Đang tiến hành";
      case "planned":
        return "Đã lên kế hoạch";
      default:
        return "";
    }
  };

  useEffect(() => {
    console.log("👉 Sprint props:", sprints);
    console.log("🧪 activeProjectId:", activeProjectId);
    console.log("🧵 Sprints truyền vào SprintsList:", sprints?.length);
  }, [sprints, activeProjectId]);

  return (
    <div className="sprints-container">
      <div className="sprints-header">
        <h2>{activeProjectId ? "Sprints của dự án" : "Tất cả các Sprints"}</h2>
        <button className="create-sprint-btn" onClick={onCreateSprint}>
          <span className="btn-icon">+</span>
          <span>Tạo Sprint mới</span>
        </button>
      </div>

      <div className="sprints-list">
        {sprints.length > 0 ? (
          sprints.map((sprint) => (
            <div
              key={sprint.id}
              className={`sprint-card ${getStatusClass(sprint.status)}`}
              onClick={() => onSprintClick(sprint)}
            >
              <div className="sprint-header">
                <h3 className="sprint-name">{sprint.name}</h3>
                <span
                  className={`sprint-status ${getStatusClass(sprint.status)}`}
                >
                  {getStatusText(sprint.status)}
                </span>
              </div>

              <div className="sprint-dates">
                <div className="date-group">
                  <label>Bắt đầu</label>
                  <span>{sprint.startDate}</span>
                </div>
                <div className="date-group">
                  <label>Kết thúc</label>
                  <span>{sprint.endDate}</span>
                </div>
              </div>

              <div className="sprint-progress">
                <div className="progress-info">
                  <span>Tiến độ</span>
                  <span>{sprint.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${sprint.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="sprint-stats">
                <div className="stats-item">
                  <span className="stats-label">Tổng số task</span>
                  <span className="stats-value">{sprint.totalTasks || 0}</span>
                </div>
                <div className="stats-item">
                  <span className="stats-label">Đã hoàn thành</span>
                  <span className="stats-value">
                    {sprint.completedTasks || 0}
                  </span>
                </div>
              </div>

              <div className="sprint-actions">
                <button
                  className="view-sprint-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSprintClick(sprint);
                  }}
                >
                  Xem chi tiết
                </button>
                {sprint.status === "active" && (
                  <button
                    className="complete-sprint-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("👉 Kết thúc sprint...");
                    }}
                  >
                    Kết thúc Sprint
                  </button>
                )}
                <button
                  className="assign-backlog-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSprint(sprint);
                    setShowBacklogForm(true);
                  }}
                >
                  + Sprint Backlog
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-sprints">
            <p>
              Chưa có sprint nào. Hãy tạo sprint đầu tiên để bắt đầu quản lý
              công việc.
            </p>
          </div>
        )}
      </div>

      {showBacklogForm && selectedSprint && (
        <CreateSprintBacklogForm
          sprint={selectedSprint}
          productBacklogs={mockProductBacklogs}
          onClose={() => setShowBacklogForm(false)}
          onSubmit={(selectedItems) => {
            console.log("✅ Đã chọn Sprint Backlogs:", selectedItems);
            setShowBacklogForm(false);
          }}
        />
      )}
    </div>
  );
};

export default SprintsList;
