import React from 'react';
import { useParams } from 'react-router-dom';
import './SprintsList.css';

const SprintsList = () => {
  // eslint-disable-next-line
  const { boardId } = useParams();
  
  // Sample data for sprints
  const sprints = [
    {
      id: 'sprint1',
      name: 'Sprint 1 - Initial Setup',
      status: 'completed',
      startDate: '01/03/2025',
      endDate: '15/03/2025',
      totalTasks: 8,
      completedTasks: 8,
      progress: 100
    },
    {
      id: 'sprint2',
      name: 'Sprint 2 - Core Features',
      status: 'completed',
      startDate: '16/03/2025',
      endDate: '31/03/2025',
      totalTasks: 10,
      completedTasks: 10,
      progress: 100
    },
    {
      id: 'sprint3',
      name: 'Sprint 3 - User Authentication',
      status: 'active',
      startDate: '01/04/2025',
      endDate: '15/04/2025',
      totalTasks: 12,
      completedTasks: 8,
      progress: 67
    },
    {
      id: 'sprint4',
      name: 'Sprint 4 - Dashboard Implementation',
      status: 'active',
      startDate: '16/04/2025',
      endDate: '30/04/2025',
      totalTasks: 15,
      completedTasks: 3,
      progress: 20
    },
    {
      id: 'sprint5',
      name: 'Sprint 5 - Polish and Optimization',
      status: 'planned',
      startDate: '01/05/2025',
      endDate: '15/05/2025',
      totalTasks: 10,
      completedTasks: 0,
      progress: 0
    }
  ];

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
        return 'Đang tiến hành';
      case 'planned':
        return 'Đã lên kế hoạch';
      default:
        return '';
    }
  };

  return (
    <div className="sprints-container">
      <div className="sprints-header">
        <h2>Sprints</h2>
        <button className="create-sprint-btn">
          <span className="btn-icon">+</span>
          <span>Tạo Sprint mới</span>
        </button>
      </div>
      
      <div className="sprints-list">
        {sprints.map(sprint => (
          <div key={sprint.id} className={`sprint-card ${getStatusClass(sprint.status)}`}>
            <div className="sprint-header">
              <h3 className="sprint-name">{sprint.name}</h3>
              <span className={`sprint-status ${getStatusClass(sprint.status)}`}>
                {getStatusText(sprint.status)}
              </span>
            </div>
            
            <div className="sprint-dates">
              <div className="date-group">
                <label>Bắt đầu</label>
                <span>{sprint.startDate}</span>
              </div>
              <div className="date-group">
                <label>Kết thúc</label>
                <span>{sprint.endDate}</span>
              </div>
            </div>
            
            <div className="sprint-progress">
              <div className="progress-info">
                <span>Tiến độ</span>
                <span>{sprint.progress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${sprint.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="sprint-stats">
              <div className="stats-item">
                <span className="stats-label">Tổng số task</span>
                <span className="stats-value">{sprint.totalTasks}</span>
              </div>
              <div className="stats-item">
                <span className="stats-label">Đã hoàn thành</span>
                <span className="stats-value">{sprint.completedTasks}</span>
              </div>
            </div>
            
            <div className="sprint-actions">
              <button className="view-sprint-btn">Xem chi tiết</button>
              {sprint.status === 'active' && (
                <button className="complete-sprint-btn">Kết thúc Sprint</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SprintsList;