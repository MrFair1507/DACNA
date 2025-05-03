// import React, { useState } from 'react';
// // import { useParams } from 'react-router-dom';
// import './KanbanBoard.css';
// import KanbanColumn from './KanbanColumn';
// // import TaskDetailModal from './TaskDetailModal';
// // import AddTaskForm from './AddTaskForm';

// const KanbanBoard = ({ boardId, columns, onAddTask, onTaskClick, onTaskMoved }) => {
//     // State cho drag and drop
//     const [draggedTask, setDraggedTask] = useState(null);
//     const [draggedColumn, setDraggedColumn] = useState(null);
  
//     // Xử lý khi bắt đầu kéo task
//     const handleDragStart = (task, columnId) => {
//       setDraggedTask(task);
//       setDraggedColumn(columnId);
//     };
  
//     // Xử lý khi kéo task qua một element
//     const handleDragOver = (e) => {
//       e.preventDefault();
//     };
  
//     // Xử lý khi thả task vào một cột
//     const handleDrop = (columnId) => {
//       if (!draggedTask || !draggedColumn) return;
      
//       // Nếu thả vào cùng cột thì không làm gì
//       if (draggedColumn === columnId) {
//         setDraggedTask(null);
//         setDraggedColumn(null);
//         return;
//       }
      
//       // Thông báo cho component cha về việc di chuyển task
//       onTaskMoved(draggedTask.id, draggedColumn, columnId);
      
//       // Reset trạng thái drag and drop
//       setDraggedTask(null);
//       setDraggedColumn(null);
//     };
  
//     // Tạo danh sách các column từ object columns
//     const renderColumns = () => {
//       return Object.values(columns).map(column => (
//         <KanbanColumn
//           key={column.id}
//           column={column}
//           onDragStart={handleDragStart}
//           onDragOver={handleDragOver}
//           onDrop={handleDrop}
//           onTaskClick={onTaskClick}
//           onAddTask={() => onAddTask(column.id)}
//         />
//       ));
//     };
  
//     return (
//       <div className="kanban-board">
//         {renderColumns()}
//       </div>
//     );
//   };

// export default KanbanBoard;


import React, { useState } from 'react';
import './KanbanBoard.css';
import KanbanColumn from './KanbanColumn';
// eslint-disable-next-line 
import TaskDetailModal from './TaskDetailModal';
// eslint-disable-next-line 
import AddTaskForm from './AddTaskForm';

const KanbanBoard = ({ boardId, columns, sprint, onAddTask, onTaskClick, onTaskMoved }) => {
    // State cho drag and drop
    const [draggedTask, setDraggedTask] = useState(null);
    const [draggedColumn, setDraggedColumn] = useState(null);
  
    // Xử lý khi bắt đầu kéo task
    const handleDragStart = (task, columnId) => {
      setDraggedTask(task);
      setDraggedColumn(columnId);
    };
  
    // Xử lý khi kéo task qua một element
    const handleDragOver = (e) => {
      e.preventDefault();
    };
  
    // Xử lý khi thả task vào một cột
    const handleDrop = (columnId) => {
      if (!draggedTask || !draggedColumn) return;
      
      // Nếu thả vào cùng cột thì không làm gì
      if (draggedColumn === columnId) {
        setDraggedTask(null);
        setDraggedColumn(null);
        return;
      }
      
      // Thông báo cho component cha về việc di chuyển task
      onTaskMoved(draggedTask.id, draggedColumn, columnId);
      
      // Reset trạng thái drag and drop
      setDraggedTask(null);
      setDraggedColumn(null);
    };
  
    // Tạo danh sách các column từ object columns
    const renderColumns = () => {
      return Object.values(columns).map(column => (
        <KanbanColumn
          key={column.id}
          column={column}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onTaskClick={onTaskClick}
          onAddTask={() => onAddTask(column.id)}
        />
      ));
    };
    
    // Hiển thị thông tin sprint nếu có
    const renderSprintInfo = () => {
      if (!sprint) return null;
      
      return (
        <div className="sprint-info">
          <div className="sprint-info-header">
            <h3>{sprint.name}</h3>
            <span className={`sprint-status status-${sprint.status}`}>
              {sprint.status === 'active' && 'Đang tiến hành'}
              {sprint.status === 'completed' && 'Hoàn thành'}
              {sprint.status === 'planned' && 'Đã lên kế hoạch'}
            </span>
          </div>
          <div className="sprint-dates">
            <span>Bắt đầu: {sprint.startDate}</span>
            <span>Kết thúc: {sprint.endDate}</span>
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
        </div>
      );
    };
  
    return (
      <div className="kanban-container">
        {renderSprintInfo()}
        <div className="kanban-board">
          {renderColumns()}
        </div>
      </div>
    );
  };

export default KanbanBoard;