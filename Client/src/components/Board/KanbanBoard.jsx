import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './KanbanBoard.css';
import KanbanColumn from './KanbanColumn';
import TaskDetailModal from './TaskDetailModal';
import AddTaskForm from './AddTaskForm';

const KanbanBoard = ({ boardId, columns, onAddTask, onTaskClick, onTaskMoved }) => {
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
  
    return (
      <div className="kanban-board">
        {renderColumns()}
      </div>
    );
  };

export default KanbanBoard;