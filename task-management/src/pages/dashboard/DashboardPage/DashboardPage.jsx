import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import './DashboardPage.css';
import Sidebar from '../../../components/Layout/Sidebar/Sidebar';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('board');

  // Sample data for the board
  const [columns, setColumns] = useState({
    backlog: {
      id: 'backlog',
      title: 'Backlog',
      count: 2,
      tasks: [
        { 
          id: 't1', 
          content: 'User authentication flow', 
          priority: 'high', 
          assignee: 'Minh Huynh', 
          assigneeInitial: 'M',
          dueDate: '25/04/2025'
        },
        { 
          id: 't2', 
          content: 'Database schema design', 
          priority: 'medium', 
          assignee: 'Team member',
          assigneeInitial: 'T', 
          dueDate: '28/04/2025'
        }
      ]
    },
    todo: {
      id: 'todo',
      title: 'To Do',
      count: 2,
      tasks: [
        { 
          id: 't3', 
          content: 'API documentation', 
          priority: 'medium', 
          assignee: 'Dang Ho',
          assigneeInitial: 'D', 
          dueDate: '30/04/2025'
        },
        { 
          id: 't4', 
          content: 'UI component library', 
          priority: 'low', 
          assignee: 'Tri Vu',
          assigneeInitial: 'T', 
          dueDate: '02/05/2025'
        }
      ]
    },
    inProgress: {
      id: 'inProgress',
      title: 'In Progress',
      count: 1,
      tasks: [
        { 
          id: 't5', 
          content: 'Kanban Board Implementation', 
          priority: 'high', 
          assignee: 'Minh Huynh',
          assigneeInitial: 'M', 
          dueDate: '20/04/2025'
        }
      ]
    },
    review: {
      id: 'review',
      title: 'Đang xét duyệt',
      count: 1,
      tasks: [
        { 
          id: 't6', 
          content: 'Code review cho sprint 5', 
          priority: 'medium', 
          assignee: 'Khoa Nguyen',
          assigneeInitial: 'K', 
          dueDate: '17/04/2025'
        }
      ]
    },
    done: {
      id: 'done',
      title: 'Hoàn thành',
      count: 2,
      tasks: [
        { 
          id: 't7', 
          content: 'Thiết lập môi trường dev', 
          priority: 'high', 
          assignee: 'Dat Chau',
          assigneeInitial: 'D', 
          dueDate: '15/04/2025'
        },
        { 
          id: 't8', 
          content: 'Báo cáo tiến độ hàng tuần', 
          priority: 'low', 
          assignee: 'Kien Vo',
          assigneeInitial: 'K', 
          dueDate: '14/04/2025'
        }
      ]
    }
  });

  // State cho popup thêm thẻ
  const [showAddCardForm, setShowAddCardForm] = useState(false);
  // eslint-disable-next-line
  const [selectedColumn, setSelectedColumn] = useState(null);

  // Handle drag and drop
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedColumn, setDraggedColumn] = useState(null);

  const handleDragStart = (task, columnId) => {
    setDraggedTask(task);
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (columnId) => {
    if (!draggedTask) return;
    
    const newColumns = {...columns};
    newColumns[draggedColumn].tasks = newColumns[draggedColumn].tasks.filter(
      task => task.id !== draggedTask.id
    );
    newColumns[draggedColumn].count = newColumns[draggedColumn].tasks.length;
    
    newColumns[columnId].tasks.push(draggedTask);
    newColumns[columnId].count = newColumns[columnId].tasks.length;
    
    setColumns(newColumns);
    setDraggedTask(null);
    setDraggedColumn(null);
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const getPriorityText = (priority) => {
    switch(priority) {
      case 'high':
        return 'Cao';
      case 'medium':
        return 'Trung bình';
      case 'low':
        return 'Thấp';
      default:
        return '';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
     <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        
        <header className="main-header">
          <div className="app-title">
            <h1>Quản lý công việc</h1>
          </div>
          
          <div className="search-bar">
            <input type="text" placeholder="Tìm kiếm..." />
            <button className="search-btn">
              <i className="icon-search"></i>
            </button>
          </div>
          
          <div className="user-profile" onClick={logout}>
            <div className="notification-icon">
              <i className="icon-notification"></i>
            </div>
            <div className="user-avatar">
              <span>{user?.firstName?.[0] || 'N'}{user?.lastName?.[0] || 'T'}</span>
            </div>
          </div>
        </header>
        
        {/* Project Header */}
        <div className="project-header">
          <div className="project-title">
            <h2>Dự án hiện tại</h2>
          </div>
          
          <div className="project-tabs">
            <div className={`tab ${activeTab === 'board' ? 'active' : ''}`} onClick={() => setActiveTab('board')}>
              Board
            </div>
            <div className={`tab ${activeTab === 'backlog' ? 'active' : ''}`} onClick={() => setActiveTab('backlog')}>
              Backlog
            </div>
            <div className={`tab ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
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
            <button className="add-task-btn" onClick={() => setShowAddCardForm(true)}>
              <span className="btn-icon">+</span>
              <span>Thêm công việc</span>
            </button>
          </div>
        </div>
        
        {/* Kanban Board */}
        {activeTab === 'board' && (
          <div className="kanban-board">
            {Object.values(columns).map(column => (
              <div 
                key={column.id}
                className="kanban-column"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(column.id)}
              >
                <div className="column-header">
                  <h3>{column.title}</h3>
                  <span className="task-count">{column.count}</span>
                  <button className="column-menu-btn">
                    <i className="icon-more"></i>
                  </button>
                </div>
                
                <div className="column-tasks">
                  {column.tasks.map(task => (
                    <div
                      key={task.id}
                      className="task-card"
                      draggable
                      onDragStart={() => handleDragStart(task, column.id)}
                    >
                      <h4 className="task-title">{task.content}</h4>
                      <div className="task-meta">
                        <div className="task-assignee">
                          <span>Người phụ trách: {task.assignee}</span>
                        </div>
                        <div className="task-details">
                          <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                            {getPriorityText(task.priority)}
                          </span>
                          <span className="due-date">{task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    className="add-card-btn"
                    onClick={() => {
                      setSelectedColumn(column.id);
                      setShowAddCardForm(true);
                    }}
                  >
                    <span className="btn-icon">+</span>
                    <span>Thêm thẻ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popup thêm thẻ */}
      {showAddCardForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Thêm thẻ mới</h3>
              <button className="close-btn" onClick={() => setShowAddCardForm(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Tiêu đề thẻ</label>
                <input type="text" className="form-control" placeholder="Nhập tiêu đề thẻ" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Người phụ trách</label>
                <input type="text" className="form-control" placeholder="Nhập tên người phụ trách" />
              </div>
              
              <div className="form-row">
                <div className="form-group half">
                  <label className="form-label">Ngày hết hạn</label>
                  <input type="text" className="form-control" placeholder="VD: 25/04/2025" />
                </div>
                
                <div className="form-group half">
                  <label className="form-label">Mức độ ưu tiên</label>
                  <select className="form-control">
                    <option value="high">Cao</option>
                    <option value="medium">Trung bình</option>
                    <option value="low">Thấp</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea className="form-control" rows="3" placeholder="Nhập mô tả chi tiết cho thẻ"></textarea>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowAddCardForm(false)}
              >
                Hủy
              </button>
              <button className="submit-btn">Thêm thẻ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;