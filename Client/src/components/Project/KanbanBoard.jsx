// 📁 src/components/Project/KanbanBoard.jsx
import React, { useState, useEffect, useCallback } from "react";
import "./KanbanBoard.css";
import KanbanColumn from "./KanbanColumn";
import api from "../../services/api";

const KanbanBoard = ({
  sprintId,
  sprint,
  onAddTask,
  onTaskClick,
  onTaskMoved,
  templateType = "default",
}) => {
  const [columns, setColumns] = useState({});
  const [progress, setProgress] = useState(0);
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedColumn, setDraggedColumn] = useState(null);

  const getDefaultColumns = useCallback(() => {
    const base = {
      notStarted: { id: "notStarted", title: "Chưa phân loại", tasks: [] },
      todo: { id: "todo", title: "To Do", tasks: [] },
      inProgress: { id: "inProgress", title: "In Progress", tasks: [] },
    };
    if (templateType !== "scrum") {
      base.review = { id: "review", title: "Review", tasks: [] };
    }
    base.done = { id: "done", title: "Done", tasks: [] };
    return base;
  }, [templateType]);

  const mapStatusToColumn = useCallback(
    (status) => {
      const normalized = (status || "").toLowerCase().replace(/\s/g, "");
      if (normalized === "notstarted") return "notStarted";
      if (normalized === "todo") return "todo";
      if (normalized === "inprogress") return "inProgress";
      if (normalized === "review") {
        return templateType === "scrum" ? "inProgress" : "review";
      }
      if (normalized === "completed") return "done";
      return "notStarted";
    },
    [templateType]
  );

  const reverseMapColumnToStatus = (columnId) => {
    switch (columnId) {
      case "notStarted":
      case "todo":
        return "Not Started";
      case "inProgress":
      case "review":
        return "In Progress";
      case "done":
        return "Completed";
      default:
        return "Not Started";
    }
  };

  const formatPriority = (value) => {
    if (!value) return "Medium";
    const normalized =
      value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    return ["Low", "Medium", "High"].includes(normalized)
      ? normalized
      : "Medium";
  };

  const formatTask = useCallback((task) => {
    const rawStatus = (task.task_status || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");
    const finalStatus =
      {
        notstarted: "Not Started",
        todo: "To Do",
        inprogress: "In Progress",
        review: "In Progress",
        completed: "Completed",
      }[rawStatus] || "Not Started";

    return {
      id: `task-${task.task_id}`,
      task_id: task.task_id,
      title: task.task_title || "(Không có tiêu đề)",
      description: task.task_description || "",
      content: task.task_title || "(Không có tiêu đề)",
      priority: formatPriority(task.priority),
      assignee: task.assignee_name || "Unassigned",
      assigneeId: task.assigned_user_id || null,
      assigneeInitial: (task.assignee_name?.[0] || "U").toUpperCase(),
      dueDate: task.due_date
        ? new Date(task.due_date).toLocaleDateString("vi-VN")
        : "",
      start_date: task.start_date || null,
      status: finalStatus,
      task_status: finalStatus,
      sprint_backlog_id: task.sprint_backlog_id,
    };
  }, []);

  const loadTasksFromAPI = useCallback(async () => {
    try {
      const newColumns = getDefaultColumns();
      const backlogRes = await api.get(`/sprints/${sprintId}/backlog`);
      const backlogs = backlogRes.data || [];

      for (const backlog of backlogs) {
        const { sprint_backlog_id, title } = backlog;
        const tasksRes = await api.get(
          `/tasks/backlog/${sprint_backlog_id}/tasks`
        );
        const tasks = tasksRes.data || [];

        for (const task of tasks) {
          const formatted = {
            ...formatTask(task),
            sprint_backlog_title: title || "",
          };
          const columnId = mapStatusToColumn(formatted.task_status);
          (newColumns[columnId] || newColumns.notStarted).tasks.push(formatted);
        }
      }

      setColumns(newColumns);

      let total = 0;
      let completed = 0;
      Object.values(newColumns).forEach((col) => {
        col.tasks.forEach((task) => {
          total++;
          if (task.task_status === "Completed") completed++;
        });
      });
      setProgress(total > 0 ? Math.round((completed / total) * 100) : 0);
    } catch (err) {
      console.error("❌ Lỗi khi tải backlog:", err);
      setColumns(getDefaultColumns());
      setProgress(0);
    }
  }, [sprintId, getDefaultColumns, formatTask, mapStatusToColumn]);

  useEffect(() => {
    if (sprintId) loadTasksFromAPI();
    else setColumns(getDefaultColumns());
  }, [sprintId, loadTasksFromAPI, getDefaultColumns]);

  const handleDragStart = (task, columnId) => {
    setDraggedTask(task);
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = async (targetColumnId) => {
  if (!draggedTask || draggedColumn === targetColumnId) return resetDragState();

  try {
    const newStatus = reverseMapColumnToStatus(targetColumnId);
    const formatDate = (d) => (d ? new Date(d).toISOString().split("T")[0] : null);

    const payload = {
      task_title: draggedTask.title,
      task_description: draggedTask.description,
      task_status: newStatus,
      priority: formatPriority(draggedTask.priority),
      start_date: formatDate(draggedTask.start_date),
      due_date: formatDate(draggedTask.dueDate),
    };

    await api.put(`/tasks/${draggedTask.task_id}`, payload);

    const updatedTask = {
      ...draggedTask,
      status: newStatus,
      task_status: newStatus,
    };

    setColumns((prev) => {
      const updated = { ...prev };

      const sourceCol = { ...updated[draggedColumn], tasks: [...updated[draggedColumn].tasks] };
      const targetCol = { ...updated[targetColumnId], tasks: [...updated[targetColumnId].tasks] };

      sourceCol.tasks = sourceCol.tasks.filter((t) => t.id !== draggedTask.id);
      targetCol.tasks.push(updatedTask);

      updated[draggedColumn] = sourceCol;
      updated[targetColumnId] = targetCol;

      return updated;
    });

    onTaskMoved?.(draggedTask.id, draggedColumn, targetColumnId);
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật task:", err);
  } finally {
    resetDragState();
  }
};


  const resetDragState = () => {
    setDraggedTask(null);
    setDraggedColumn(null);
  };

  return (
    <div className="kanban-container">
      {sprint && (
        <div className="sprint-info">
          <div className="sprint-info-header">
            <h3>{sprint.name}</h3>
            <span className={`sprint-status status-${sprint.status}`}>
              {sprint.status === "active"
                ? "Đang tiến hành"
                : sprint.status === "completed"
                ? "Hoàn thành"
                : "Đã lên kế hoạch"}
            </span>
          </div>
          <div className="sprint-dates">
            <span>Bắt đầu: {sprint.startDate}</span>
            <span>Kết thúc: {sprint.endDate}</span>
          </div>
          <div className="sprint-progress">
            <div className="progress-info">
              <span>Tiến độ</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <div className="kanban-board">
        {Object.values(columns).map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
