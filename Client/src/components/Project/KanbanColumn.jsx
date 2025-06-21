import React from "react";
import "./KanbanColumn.css";
import TaskCard from "./TaskCard";

const KanbanColumn = ({
  column,
  onDragStart,
  onDragOver,
  onDrop,
  onTaskClick,
}) => {
  const isDisabled = !onDragStart || !onDrop; // Nếu sprint hết hạn, các hàm này không được truyền vào

  return (
    <div
      className={`kanban-column column-${column.id} ${isDisabled ? "disabled-column" : ""}`}
      onDragOver={onDragOver}
      onDrop={() => onDrop?.(column.id)}
    >
      <div className="column-header">
        <h3>{column.title}</h3>
        <span className="task-count">{column.tasks.length}</span>
        <button className="column-menu-btn" disabled={isDisabled} title={isDisabled ? "Sprint đã hết hạn" : ""}>
          <i className="icon-more">⋮</i>
        </button>
      </div>

      <div className="column-tasks">
        {column.tasks.map((task) => (
          <TaskCard
            key={task.task_id}
            task={task}
            onDragStart={onDragStart ? () => onDragStart(task, column.id) : undefined}
            onClick={() => onTaskClick(task, column.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
