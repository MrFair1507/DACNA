import React from "react";
import "./SprintBacklogCard.css";

const SprintBacklogCard = ({ backlog }) => {
  return (
    <div className="card backlog-card">
      <h3>{backlog.title}</h3>
      <p>{backlog.description}</p>
      {backlog.creator && <small>Người tạo: {backlog.creator.full_name}</small>}
    </div>
  );
};

export default SprintBacklogCard;
