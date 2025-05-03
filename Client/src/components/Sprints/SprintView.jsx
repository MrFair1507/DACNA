// components/Sprints/SprintView.jsx - Component mới để hiển thị chi tiết sprint
import React, { useState } from 'react';
import './SprintView.css';
import KanbanBoard from '../Board/KanbanBoard';

const SprintView = ({ sprint, onBack, onAddTask, onTaskClick, onTaskMoved }) => {
  const [activeTab, setActiveTab] = useState('board'); // 'board', 'backlog', 'reports'
  
  // Mẫu dữ liệu cho các cột Kanban
  // eslint-disable-next-line
  const [columns, setColumns] = useState({
    todo: {
      id: 'todo',
      title: 'To Do',
      tasks: sprint.tasks?.filter(task => task.status === 'todo') || []
    },
    inProgress: {
      id: 'inProgress',
      title: 'In Progress',
      tasks: sprint.tasks?.filter(task => task.status === 'inProgress') || []
    },
    review: {
      id: 'review',
      title: 'Đang xét duyệt',
      tasks: sprint.tasks?.filter(task => task.status === 'review') || []
    },
    done: {
      id: 'done',
      title: 'Hoàn thành',
      tasks: sprint.tasks?.filter(task => task.status === 'done') || []
    }
  });
  
  const getStatusClass = (status) => {
    switch(status) {
      case 'completed':
        return 'status-completed';
      case 'active': 
        return 'status-active';
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
      case 'active':
        return 'Đang thực hiện';
      case 'planned':
        return 'Đã lên kế hoạch';
      default:
        return '';
    }
  };
  
  return (
    <div className="sprint-view">
      {/* Header của sprint */}
      <div className="project-header">
        <div className="project-title">
          <button className="back-btn" onClick={onBack}>
            <i className="icon-arrow-left">←</i>
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
            <i className="icon-notification">🔔</i>
            <span>Thông báo</span>
          </button>
          <button className="members-btn">
            <i className="icon-members">👥</i>
            <span>Thành viên</span>
          </button>
          <button className="add-task-btn" onClick={() => onAddTask('todo')}>
            <span className="btn-icon">+</span>
            <span>Thêm công việc</span>
          </button>
        </div>
      </div>
      
      {/* Nội dung chính của sprint */}
      <div className="sprint-view-content">
        {activeTab === 'board' && (
          <KanbanBoard
            boardId={null}
            sprintId={sprint.id}
            columns={columns}
            onAddTask={onAddTask}
            onTaskClick={onTaskClick}
            onTaskMoved={onTaskMoved}
          />
        )}
        
        {activeTab === 'backlog' && (
          <div className="placeholder-view">
            <div className="placeholder-icon">📋</div>
            <h3>Backlog của Sprint</h3>
            <p>
              Tại đây bạn có thể quản lý các task chưa phân loại vào các cột trên board.
            </p>
          </div>
        )}
        
        {activeTab === 'reports' && (
          <div className="placeholder-view">
            <div className="placeholder-icon">📊</div>
            <h3>Báo cáo Sprint</h3>
            <p>
              Xem tổng quan về tiến độ của sprint, burndown chart và các chỉ số quan trọng khác.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SprintView;