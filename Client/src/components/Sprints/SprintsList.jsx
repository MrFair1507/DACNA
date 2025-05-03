// // src/components/Sprints/SprintsList.jsx
// import React from 'react';
// import './SprintsList.css';

// const SprintsList = ({ sprints, onCreateSprint, onSprintClick }) => {
//   const getStatusClass = (status) => {
//     switch(status) {
//       case 'completed':
//         return 'status-completed';
//       case 'active':
//         return 'status-active';
//       case 'planned':
//         return 'status-planned';
//       default:
//         return '';
//     }
//   };

//   const getStatusText = (status) => {
//     switch(status) {
//       case 'completed':
//         return 'Hoàn thành';
//       case 'active':
//         return 'Đang tiến hành';
//       case 'planned':
//         return 'Đã lên kế hoạch';
//       default:
//         return '';
//     }
//   };

//   return (
//     <div className="sprints-container">
//       <div className="sprints-header">
//         <h2>Sprints</h2>
//         <button 
//           className="create-sprint-btn"
//           onClick={onCreateSprint}
//         >
//           <span className="btn-icon">+</span>
//           <span>Tạo Sprint mới</span>
//         </button>
//       </div>
      
//       <div className="sprints-list">
//         {sprints.length > 0 ? (
//           sprints.map(sprint => (
//             <div 
//               key={sprint.id} 
//               className={`sprint-card ${getStatusClass(sprint.status)}`}
//               onClick={() => onSprintClick(sprint)}
//             >
//               <div className="sprint-header">
//                 <h3 className="sprint-name">{sprint.name}</h3>
//                 <span className={`sprint-status ${getStatusClass(sprint.status)}`}>
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
//                   <span className="stats-value">{sprint.totalTasks}</span>
//                 </div>
//                 <div className="stats-item">
//                   <span className="stats-label">Đã hoàn thành</span>
//                   <span className="stats-value">{sprint.completedTasks}</span>
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
//                 {sprint.status === 'active' && (
//                   <button 
//                     className="complete-sprint-btn"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       // Thêm hàm hoàn thành sprint ở đây
//                       console.log("Cần thêm chức năng hoàn thành sprint");
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
//             <p>Chưa có sprint nào. Hãy tạo sprint đầu tiên để bắt đầu quản lý công việc.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SprintsList;
import React from 'react';
import './SprintsList.css';

const SprintsList = ({ sprints, onCreateSprint, onSprintClick, activeBoardId }) => {
  const getStatusClass = (status) => {
    switch(status) {
      case 'completed':
        return 'status-completed';
      case 'active':
        return 'status-active';
      case 'planned':
        return 'status-planned';
      default:
        return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'completed':
        return 'Hoàn thành';
      case 'active':
        return 'Đang tiến hành';
      case 'planned':
        return 'Đã lên kế hoạch';
      default:
        return '';
    }
  };

  // Lọc sprints theo board hiện tại nếu có
  const filteredSprints = activeBoardId 
    ? sprints.filter(sprint => sprint.boardId === activeBoardId)
    : sprints;

  return (
    <div className="sprints-container">
      <div className="sprints-header">
        <h2>{activeBoardId ? 'Sprints của dự án' : 'Tất cả các Sprints'}</h2>
        <button 
          className="create-sprint-btn"
          onClick={onCreateSprint}
        >
          <span className="btn-icon">+</span>
          <span>Tạo Sprint mới</span>
        </button>
      </div>
      
      <div className="sprints-list">
        {filteredSprints.length > 0 ? (
          filteredSprints.map(sprint => (
            <div 
              key={sprint.id} 
              className={`sprint-card ${getStatusClass(sprint.status)}`}
              onClick={() => onSprintClick(sprint)}
            >
              <div className="sprint-header">
                <h3 className="sprint-name">{sprint.name}</h3>
                <span className={`sprint-status ${getStatusClass(sprint.status)}`}>
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
                  <span className="stats-value">{sprint.completedTasks || 0}</span>
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
                {sprint.status === 'active' && (
                  <button 
                    className="complete-sprint-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Thêm hàm hoàn thành sprint ở đây
                      console.log("Cần thêm chức năng hoàn thành sprint");
                    }}
                  >
                    Kết thúc Sprint
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-sprints">
            <p>Chưa có sprint nào. Hãy tạo sprint đầu tiên để bắt đầu quản lý công việc.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SprintsList;