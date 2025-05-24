import React from "react";
import './SprintBacklogList.css';
import SprintBacklogCard from "./SprintbacklogCard";


const SprintBacklogList = ({ items }) => {
  if (!items || items.length === 0) {
    return <p style={{ color: "#aaa" }}>Không có backlog nào được tìm thấy.</p>;
  }
  // eslint-disable-next-lin
const mockSprintBacklogs = [
  {
    sprint_backlog_id: 101,
    title: "Đăng ký người dùng",
    description: "Xây dựng chức năng đăng ký tài khoản"
  },
  {
    sprint_backlog_id: 102,
    title: "Đăng nhập",
    description: "Xác thực tài khoản và phân quyền"
  },
  {
    sprint_backlog_id: 103,
    title: "Giao diện Kanban",
    description: "Hiển thị các cột và nhiệm vụ"
  }
];

  return (
    <div className="backlog-list">
      {items.map((item) => (
        <SprintBacklogCard key={item.id || item.sprint_backlog_id} backlog={item} />
      ))}
    </div>
  );
};

export default SprintBacklogList;
