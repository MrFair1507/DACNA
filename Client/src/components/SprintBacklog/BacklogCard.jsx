import React from "react";
import "./BacklogCard.css";

const BacklogCard = ({ backlog }) => {
  const {
    title,
    description,
    status,
    created_at,
    creator = {},
  } = backlog;

  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString("vi-VN")
    : "Không rõ";

  return (
    <div className="card backlog-card">
      <h3>{title}</h3>
      <p>{description || <i style={{ color: "#aaa" }}>Không có mô tả</i>}</p>

      <div className="backlog-meta">
        <div>
          <strong>Trạng thái:</strong> {status || "Pending"}
        </div>
        <div>
          <strong>Ngày tạo:</strong> {formattedDate}
        </div>
        {creator?.full_name && (
          <div>
            <strong>Người tạo:</strong> {creator.full_name}
          </div>
        )}
      </div>
    </div>
  );
};

export default BacklogCard;
