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
  return (
    <div
      className={`kanban-column column-${column.id}`}
      onDragOver={onDragOver}
      onDrop={() => onDrop?.(column.id)}
    >
      <div className="column-header">
        <h3>{column.title}</h3>
        <span className="task-count">{column.tasks.length}</span>
        <button className="column-menu-btn">
          <i className="icon-more">⋮</i>
        </button>
      </div>

      <div className="column-tasks">
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={() => onDragStart?.(task, column.id)}
            onClick={() => onTaskClick(task, column.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
