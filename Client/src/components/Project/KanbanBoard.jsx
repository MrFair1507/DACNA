import React, {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import "./KanbanBoard.css";
import KanbanColumn from "./KanbanColumn";
import api from "../../services/api";

const statusToColumn = {
  notstarted: "notStarted",
  todo: "todo",
  inprogress: "inProgress",
  review: "review",
  completed: "done",
};

const columnToStatus = {
  notStarted: "Not Started",
  todo: "Not Started",
  inProgress: "In Progress",
  review: "In Progress",
  done: "Completed",
};

const KanbanBoard = forwardRef(({ sprintId, sprint, onAddTask, onTaskClick, onTaskMoved }, ref) => {
  const [columns, setColumns] = useState({});
  const [progress, setProgress] = useState(0);
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedColumn, setDraggedColumn] = useState(null);

  const isExpired = sprint?.end_date && new Date(sprint.end_date) < new Date();

  const getDefaultColumns = () => ({
    notStarted: { id: "notStarted", title: "Chưa phân loại", tasks: [] },
    todo: { id: "todo", title: "To Do", tasks: [] },
    inProgress: { id: "inProgress", title: "In Progress", tasks: [] },
    review: { id: "review", title: "Review", tasks: [] },
    done: { id: "done", title: "Done", tasks: [] },
  });

  const mapStatusToColumn = (status) =>
    statusToColumn[(status || "").toLowerCase().replace(/\s/g, "")] || "notStarted";

  const reverseMapColumnToStatus = (colId) => columnToStatus[colId] || "Not Started";

  const formatPriority = (val) => {
    if (!val) return "Medium";
    const v = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    return ["Low", "Medium", "High"].includes(v) ? v : "Medium";
  };

  const formatTask = useCallback((task) => {
    const normalized = (task.task_status || "").trim().toLowerCase().replace(/\s+/g, "");
    const finalStatus = columnToStatus[statusToColumn[normalized]] || "Not Started";
    return {
      task_id: task.task_id,
      title: task.task_title || "(Không có tiêu đề)",
      description: task.task_description || "",
      priority: formatPriority(task.priority),
      assignee: task.assignee_name || "Unassigned",
      assigneeId: task.assigned_user_id || null,
      assigneeInitial: (task.assignee_name?.[0] || "U").toUpperCase(),
      dueDate: task.due_date ? new Date(task.due_date).toLocaleDateString("vi-VN") : "",
      start_date: task.start_date || null,
      task_status: finalStatus,
      sprint_backlog_id: task.sprint_backlog_id,
      sprint_backlog_title: task.sprint_backlog_title || "",
    };
  }, []);

  const calculateProgress = (cols) => {
    let total = 0, done = 0;
    Object.values(cols).forEach(col =>
      col.tasks.forEach((t) => {
        total++;
        if (t.task_status === "Completed") done++;
      })
    );
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  const loadTasks = useCallback(async () => {
    try {
      const cols = getDefaultColumns();
      const backlogRes = await api.get(`/sprints/${sprintId}/backlog`);
      for (const b of backlogRes.data || []) {
        const tasksRes = await api.get(`/tasks/backlog/${b.sprint_backlog_id}/tasks`);
        for (const t of tasksRes.data || []) {
          const task = formatTask({ ...t, sprint_backlog_title: b.title });
          const colId = mapStatusToColumn(task.task_status);
          cols[colId].tasks.push(task);
        }
      }
      setColumns(cols);
    } catch (err) {
      console.error("❌ Lỗi load backlog:", err);
      setColumns(getDefaultColumns());
    }
  }, [sprintId, formatTask]);

  useEffect(() => {
    if (sprintId) loadTasks();
    else setColumns(getDefaultColumns());
  }, [sprintId, loadTasks]);

  useEffect(() => {
    setProgress(calculateProgress(columns));
  }, [columns]);

  const handleDrop = async (targetCol) => {
    if (isExpired || !draggedTask || draggedColumn === targetCol) return resetDragState();

    const taskId = draggedTask.task_id || draggedTask.id?.replace("task-", "");
    if (!taskId) return resetDragState();

    try {
      const newStatus = reverseMapColumnToStatus(targetCol);

      await api.put(`/tasks/${taskId}`, {
        task_title: draggedTask.title,
        task_description: draggedTask.description || "",
        task_status: newStatus,
        priority: formatPriority(draggedTask.priority),
        start_date: draggedTask.start_date || null,
        due_date: draggedTask.dueDate || null,
      });

      if (newStatus === "Completed" && draggedTask.assigneeId) {
        const res = await api.get("/task-assignments");
        const assignment = res.data.find(
          (a) => a.task_id === taskId && a.user_id === draggedTask.assigneeId
        );
        if (assignment) {
          await api.put(`/task-assignments/${assignment.assignment_id}`, {
            completion_percentage: 100,
            status: "Completed",
          });
        }
      }

      const updatedTask = {
        ...draggedTask,
        task_id: taskId,
        task_status: newStatus,
        status: newStatus,
      };

      setColumns((prev) => {
        const updated = getDefaultColumns();
        Object.values(prev).forEach((col) =>
          col.tasks.forEach((t) => {
            if (t.task_id !== taskId)
              updated[mapStatusToColumn(t.task_status)].tasks.push(t);
          })
        );
        updated[targetCol].tasks.push(updatedTask);
        return updated;
      });

      onTaskMoved?.(taskId, draggedColumn, targetCol);
    } catch (err) {
      console.error("❌ Drop lỗi:", err);
    } finally {
      resetDragState();
    }
  };

  const resetDragState = () => {
    setDraggedTask(null);
    setDraggedColumn(null);
  };

  const handleTaskUpdateInternal = (task) => {
    setColumns((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((colId) => {
        updated[colId].tasks = updated[colId].tasks.map((t) =>
          t.task_id === task.task_id ? { ...t, ...task } : t
        );
      });
      return updated;
    });
  };

  const handleTaskDeleteInternal = (taskId) => {
    setColumns((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((colId) => {
        updated[colId].tasks = updated[colId].tasks.filter((t) => t.task_id !== taskId);
      });
      return updated;
    });
  };

  useImperativeHandle(ref, () => ({
    handleTaskUpdateInternal,
    handleTaskDeleteInternal,
  }));

  return (
    <div className="kanban-container">
      {sprint && (
        <div className="sprint-info">
          <div className="sprint-info-header">
            <h3>{sprint.name}</h3>
            <span className={`sprint-status status-${sprint.status}`}>
              {sprint.status === "active" ? "Đang tiến hành" :
               sprint.status === "completed" ? "Hoàn thành" :
               "Đã lên kế hoạch"}
            </span>
          </div>
          <div className="sprint-progress">
            <div className="progress-info">
              <span>Tiến độ</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      )}
      <div className="kanban-board">
        {Object.values(columns).map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            onDragStart={!isExpired ? (t) => {
              setDraggedTask(t);
              setDraggedColumn(col.id);
            } : undefined}
            onDragOver={!isExpired ? (e) => e.preventDefault() : undefined}
            onDrop={!isExpired ? () => handleDrop(col.id) : undefined}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>
    </div>
  );
});

export default KanbanBoard;
