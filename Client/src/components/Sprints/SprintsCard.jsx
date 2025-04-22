import React from 'react';
import './Sprint.css';

const SprintCard = ({ sprint, onClick }) => {
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
    <div className="sprint-card" onClick={onClick}>
      <div className="sprint-header">
        <h3>{sprint.name}</h3>
        <span className={`sprint-status ${getStatusClass(sprint.status)}`}>
          {getStatusText(sprint.status)}
        </span>
      </div>
      
      <div className="sprint-dates">
        <span>{sprint.startDate}</span>
        <span> - </span>
        <span>{sprint.endDate}</span>
      </div>
      
      <div className="sprint-description">
        {sprint.description}
      </div>
      
      <div className="sprint-progress">
        <div className="progress-label">
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
    </div>
  );
};

export default SprintCard;