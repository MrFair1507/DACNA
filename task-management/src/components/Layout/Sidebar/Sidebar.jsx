import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="sidebar">
      <div className="workspace-info">
        <div className="workspace-avatar">
          <span>D</span>
        </div>
        <div className="workspace-details">
          <h3>DMT HUB</h3>
          <span className="workspace-type">Premium</span>
        </div>
      </div>
      
      <div className="sidebar-section">
        <h4>WORKSPACE</h4>
        <ul className="sidebar-menu">
          <li className={activeTab === 'board' ? 'active' : ''} onClick={() => setActiveTab('board')}>
            <span className="menu-icon">
              <i className="icon-board"></i>
            </span>
            <span>Bảng công việc</span>
          </li>
          <li className={activeTab === 'list' ? 'active' : ''} onClick={() => setActiveTab('list')}>
            <span className="menu-icon">
              <i className="icon-list"></i>
            </span>
            <span>Danh sách</span>
          </li>
          <li className={activeTab === 'calendar' ? 'active' : ''} onClick={() => setActiveTab('calendar')}>
            <span className="menu-icon">
              <i className="icon-calendar"></i>
            </span>
            <span>Lịch</span>
          </li>
        </ul>
      </div>
      
      <div className="sidebar-section">
        <h4>BẢNG CỦA BẠN</h4>
        <ul className="sidebar-menu">
          <li className="active">
            <span className="board-color color-blue"></span>
            <span>Dự án hiện tại</span>
          </li>
          <li>
            <span className="board-color color-green"></span>
            <span>Phát triển sản phẩm</span>
          </li>
          <li>
            <span className="board-color color-purple"></span>
            <span>Marketing</span>
          </li>
        </ul>
      </div>
      
      <div className="sidebar-footer">
        <button className="create-board-btn">
          <span className="btn-icon">+</span>
          <span>Tạo bảng mới</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;