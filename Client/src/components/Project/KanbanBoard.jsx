import React, { useState, useEffect } from "react";
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
  const getDefaultColumns = () => ({
    notStarted: { id: "notStarted", title: "Chưa phân loại", tasks: [] },
    todo: { id: "todo", title: "To Do", tasks: [] },
    inProgress: { id: "inProgress", title: "In Progress", tasks: [] },
    ...(templateType !== "scrum"
      ? { review: { id: "review", title: "Review", tasks: [] } }
      : {}),
    done: { id: "done", title: "Done", tasks: [] },
  });

  const [columns, setColumns] = useState(getDefaultColumns());
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedColumn, setDraggedColumn] = useState(null);

  useEffect(() => {
    if (sprintId) loadTasksFromAPI();
    else setColumns(getDefaultColumns());
    // eslint-disable-next-line
  }, [sprintId]);

  const loadTasksFromAPI = async () => {
    try {
      const newColumns = getDefaultColumns();
      const backlogRes = await api.get(`/sprints/${sprintId}/backlog`);
      const backlogs = backlogRes.data || [];

      for (const backlog of backlogs) {
        const { sprint_backlog_id, title } = backlog;
        try {
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
            (newColumns[columnId] || newColumns.notStarted).tasks.push(
              formatted
            );
          }
        } catch (taskErr) {
          console.error("❌ Lỗi lấy task:", sprint_backlog_id, taskErr);
        }
      }

      setColumns(newColumns);
    } catch (err) {
      console.error("❌ Lỗi khi tải backlog:", err);
      setColumns(getDefaultColumns());
    }
  };

  const formatPriority = (value) => {
    if (!value) return "Medium";
    const normalized = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    return ["Low", "Medium", "High"].includes(normalized) ? normalized : "Medium";
  };

  const formatTask = (task) => {
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
      content: task.task_title || "(Không có tiêu đề)",
      title: task.task_title || "(Không có tiêu đề)",
      description: task.task_description || "",
      priority: formatPriority(task.priority), // ✅ xử lý chuẩn hóa
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
  };

  const mapStatusToColumn = (status) => {
    const normalized = (status || "").toLowerCase().replace(/\s/g, "");
    if (normalized === "notstarted") return "notStarted";
    if (normalized === "todo") return "todo";
    if (normalized === "inprogress") return "inProgress";
    if (normalized === "review") return "review";
    if (normalized === "completed") return "done";
    return "notStarted";
  };

  const reverseMapColumnToStatus = (columnId) => {
    switch (columnId) {
      case "notStarted":
        return "Not Started";
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

  const handleDragStart = (task, columnId) => {
    setDraggedTask(task);
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e) => e.preventDefault();

 const handleDrop = async (targetColumnId) => {
  if (!draggedTask || draggedColumn === targetColumnId)
    return resetDragState();

  try {
    const newStatus = reverseMapColumnToStatus(targetColumnId);

    const formatDate = (dateString) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date.toISOString().split("T")[0];
    };

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

      // ❌ Xoá khỏi cột cũ
      updated[draggedColumn].tasks = updated[draggedColumn].tasks.filter(
        (t) => t.id !== draggedTask.id
      );

      // ✅ Thêm vào cột mới, đảm bảo không trùng key
      updated[targetColumnId].tasks = [
        ...updated[targetColumnId].tasks.filter(t => t.id !== updatedTask.id),
        updatedTask
      ];

      return updated;
    });

    onTaskMoved?.(draggedTask.id, draggedColumn, targetColumnId);
  } catch (error) {
    console.error("❌ Lỗi khi chuyển task:", error);
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
              <span>{sprint.progress || 0}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${sprint.progress || 0}%` }}
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
