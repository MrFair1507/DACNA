import React, { useEffect, useState } from "react";
import "./CreateSprintBacklogForm.css";
import api from "../../services/api";
import SprintBacklogCard from "../SprintBacklog/SprintBacklogCard";

const CreateSprintBacklogForm = ({
  sprint,
  projectId,
  projectMembers,
  onClose,
  onSubmit,
  onTaskCreated,
}) => {
  const [backlogs, setBacklogs] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [tab, setTab] = useState("add");
  const [sprintBacklogs, setSprintBacklogs] = useState([]);

  const fetchBacklogs = async () => {
    try {
      const res = await api.get(`/projects/${projectId}/backlog`);
      setBacklogs(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi tải backlog:", err);
    }
  };

  const fetchSprintBacklogs = async () => {
    try {
      const res = await api.get(`/sprints/${sprint.sprint_id}/backlog`);
      setSprintBacklogs(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi tải backlog của Sprint:", err);
    }
  };

  useEffect(() => {
    fetchBacklogs();
    // eslint-disable-next-line
  }, [projectId]);

  useEffect(() => {
    if (tab === "view") fetchSprintBacklogs();
    // eslint-disable-next-line
  }, [tab]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!sprint?.sprint_id) {
      alert("⚠️ Không xác định được Sprint.");
      return;
    }

    const selectedItems = backlogs.filter((item) =>
      selectedIds.includes(item.sprint_backlog_id)
    );

    try {
      await Promise.all(
        selectedItems.map((item) =>
          api.put(`/backlog/${item.sprint_backlog_id}/assign`, {
            sprint_id: sprint.sprint_id,
          })
        )
      );

      await fetchBacklogs();
      await fetchSprintBacklogs();
      setSelectedIds([]);
      setTab("view");
    } catch (err) {
      console.error("❌ Lỗi khi thêm backlog vào Sprint:", err);
      alert("Không thể thêm backlog vào Sprint.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-tabs">
            <button className={tab === "add" ? "active-tab" : ""} onClick={() => setTab("add")}>➕ Thêm backlog</button>
            <button className={tab === "view" ? "active-tab" : ""} onClick={() => setTab("view")}>📋 Xem backlog</button>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {tab === "add" && (
            <>
              <p>Chọn các Product Backlog để thêm vào Sprint:</p>
              <ol className="backlog-list">
                {backlogs.length === 0 ? (
                  <p style={{ color: "#888", marginTop: 16 }}>Không có backlog nào chưa được gán sprint.</p>
                ) : (
                  backlogs.map((item) => {
                    const selected = selectedIds.includes(item.sprint_backlog_id);
                    return (
                      <li key={item.sprint_backlog_id} className={`backlog-item ${selected ? "selected" : ""}`} onClick={() => toggleSelect(item.sprint_backlog_id)}>
                        <div className="tick">{selected && "✔"}</div>
                        <div className="backlog-text">
                          <strong>{item.title}</strong>
                          <div className="description">{item.description || <i>Không có mô tả</i>}</div>
                        </div>
                      </li>
                    );
                  })
                )}
              </ol>
            </>
          )}

          {tab === "view" && (
            <div className="sprint-backlog-list">
              {sprintBacklogs.length === 0 ? (
                <p style={{ color: "#aaa", marginTop: 16 }}>⚠️ Chưa có backlog nào trong Sprint.</p>
              ) : (
                sprintBacklogs.map((item) => (
                  <SprintBacklogCard
                    key={item.sprint_backlog_id}
                    backlog={item}
                    sprint={sprint}
                    projectId={projectId}
                    projectMembers={projectMembers}
                    onTaskCreated={onTaskCreated}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {tab === "add" && (
          <div className="modal-footer">
            <button className="cancel-btn" onClick={onClose}>Hủy</button>
            <button className="submit-btn" onClick={handleSubmit} disabled={selectedIds.length === 0}>
              Thêm vào Sprint
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateSprintBacklogForm;
