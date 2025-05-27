import React from "react";
import './BacklogList.css';
import SprintBacklogCard from "./BacklogCard";

const BacklogList = ({ items }) => {
  if (!items || items.length === 0) {
    return <p style={{ color: "#aaa" }}>Không có backlog nào được tìm thấy.</p>;
  }

  return (
    <div className="backlog-list">
      {items.map((item) => (
        <SprintBacklogCard
          key={item.sprint_backlog_id}
          backlog={item}
        />
      ))}
    </div>
  );
};

export default BacklogList;
