import React from 'react';
import './Sprint.css';

const SprintHeader = ({ sprint, activeTab, setActiveTab, onBack, onAddTask }) => {
  const getStatusClass = (status) => {
    switch(status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-in-progress';
      case 'planned':
        return 'status-planned';
      default:
        return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'completed':
        return 'Hoàn thành';
      case 'in-progress':
        return 'Đang thực hiện';
      case 'planned':
        return 'Đã lên kế hoạch';
      default:
        return '';
    }
  };

  return (
    <div className="project-header">
      <div className="project-title">
        <button className="back-btn" onClick={onBack}>
          <i className="icon-arrow-left"></i>
        </button>
        <h2>{sprint.name}</h2>
        <span className={`sprint-status ${getStatusClass(sprint.status)}`}>
          {getStatusText(sprint.status)}
        </span>
      </div>
      
      <div className="project-tabs">
        <div 
          className={`tab ${activeTab === 'board' ? 'active' : ''}`}
          onClick={() => setActiveTab('board')}
        >
          Board
        </div>
        <div 
          className={`tab ${activeTab === 'backlog' ? 'active' : ''}`}
          onClick={() => setActiveTab('backlog')}
        >
          Backlog
        </div>
        <div 
          className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </div>
      </div>
      
      <div className="project-actions">
        <button className="notification-btn">
          <i className="icon-notification"></i>
          <span>Thông báo</span>
        </button>
        <button className="members-btn">
          <i className="icon-members"></i>
          <span>Thành viên</span>
        </button>
        <button className="add-task-btn" onClick={onAddTask}>
          <span className="btn-icon">+</span>
          <span>Thêm công việc</span>
        </button>
      </div>
    </div>
  );
};

export default SprintHeader;