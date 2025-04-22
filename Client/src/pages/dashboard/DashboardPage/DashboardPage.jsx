import React, { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth"; // Import hook to get user info
import "./DashboardPage.css";

// Layout Components

import Sidebar from "../../../components/Layout/Sidebar/Sidebar";
import Header from "../../../components/Layout/Header/Header";

// Board Components

import KanbanBoard from "../../../components/Board/KanbanBoard";
import CreateBoardForm from "../../../components/UI/CreateBoardForm/CreateBoardForm";
import BoardList from "../../../components/Board/BoardList/BoardList";
import AddMembersForm from "../../../components/UI/AddMembersForm/AddMembersForm";
import AddTaskForm from "../../../components/Board/AddTaskForm";
import TaskDetailModal from "../../../components/Board/TaskDetailModal";

const DashboardPage = () => {
  const { user } = useAuth();
  const currentDate = new Date().toLocaleDateString("vi-VN");

  // Trạng thái chính của dashboard
  const [activeView, setActiveView] = useState("boardList"); // 'boardList', 'kanban', 'sprints', 'backlog', 'reports'
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [activeTab, setActiveTab] = useState("board");

  // Dữ liệu bảng và tasks
  const [boards, setBoards] = useState([
    {
      id: "board1",
      title: "Dự án chính",
      color: "purple",
      description: "Phát triển ứng dụng quản lý công việc",
      owner: "Team Dev",
      members: 8,
      template: "default",
      lastModified: "21/04/2025",
    },
    {
      id: "board2",
      title: "Marketing",
      color: "green",
      description: "Chiến dịch quảng cáo Q2 2025",
      owner: "Marketing Team",
      members: 5,
      template: "default",
      lastModified: "19/04/2025",
    },
    {
      id: "board3",
      title: "Design System",
      color: "blue",
      description: "UI/UX components và guidelines",
      owner: "Design Team",
      members: 3,
      template: "default",
      lastModified: "18/04/2025",
    },
  ]);

  const [boardMembers, setBoardMembers] = useState({
    board1: [
      {
        id: "u1",
        name: "Minh Huynh",
        role: "Admin",
        avatar: "M",
        lastActive: "21/04/2025",
      },
      {
        id: "u2",
        name: "Dang Ho",
        role: "Member",
        avatar: "D",
        lastActive: "20/04/2025",
      },
      {
        id: "u3",
        name: "Tri Vu",
        role: "Member",
        avatar: "T",
        lastActive: "19/04/2025",
      },
    ],
    board2: [
      {
        id: "u1",
        name: "Minh Huynh",
        role: "Member",
        avatar: "M",
        lastActive: "21/04/2025",
      },
      {
        id: "u4",
        name: "Khoa Nguyen",
        role: "Admin",
        avatar: "K",
        lastActive: "18/04/2025",
      },
    ],
    board3: [
      {
        id: "u5",
        name: "Dat Chau",
        role: "Admin",
        avatar: "D",
        lastActive: "20/04/2025",
      },
      {
        id: "u3",
        name: "Tri Vu",
        role: "Member",
        avatar: "T",
        lastActive: "19/04/2025",
      },
    ],
  });

  const [availableUsers] = useState([
    { id: "u1", name: "Minh Huynh", email: "minh@example.com", avatar: "M" },
    { id: "u2", name: "Dang Ho", email: "dang@example.com", avatar: "D" },
    { id: "u3", name: "Tri Vu", email: "tri@example.com", avatar: "T" },
    { id: "u4", name: "Khoa Nguyen", email: "khoa@example.com", avatar: "K" },
    { id: "u5", name: "Dat Chau", email: "dat@example.com", avatar: "D" },
    { id: "u6", name: "Kien Vo", email: "kien@example.com", avatar: "K" },
  ]);

  // Mẫu dữ liệu tasks mặc định cho từng loại bảng
  const defaultTemplates = {
    default: {
      backlog: {
        id: "backlog",
        title: "Backlog",
        tasks: [],
      },
      todo: {
        id: "todo",
        title: "To Do",
        tasks: [],
      },
      inProgress: {
        id: "inProgress",
        title: "In Progress",
        tasks: [],
      },
      review: {
        id: "review",
        title: "Đang xét duyệt",
        tasks: [],
      },
      done: {
        id: "done",
        title: "Hoàn thành",
        tasks: [],
      },
    },
    kanban: {
      todo: {
        id: "todo",
        title: "To Do",
        tasks: [],
      },
      inProgress: {
        id: "inProgress",
        title: "In Progress",
        tasks: [],
      },
      done: {
        id: "done",
        title: "Done",
        tasks: [],
      },
    },
    scrum: {
      backlog: {
        id: "backlog",
        title: "Backlog",
        tasks: [],
      },
      sprint: {
        id: "sprint",
        title: "Sprint",
        tasks: [],
      },
      review: {
        id: "review",
        title: "Review",
        tasks: [],
      },
      done: {
        id: "done",
        title: "Done",
        tasks: [],
      },
    },
    project: {
      planning: {
        id: "planning",
        title: "Lên kế hoạch",
        tasks: [],
      },
      execution: {
        id: "execution",
        title: "Thực hiện",
        tasks: [],
      },
      monitoring: {
        id: "monitoring",
        title: "Giám sát",
        tasks: [],
      },
      closing: {
        id: "closing",
        title: "Kết thúc",
        tasks: [],
      },
    },
  };

  // Ví dụ dữ liệu tasks chia theo boardId
  const [boardTasks, setBoardTasks] = useState({
    board1: {
      backlog: {
        id: "backlog",
        title: "Backlog",
        tasks: [
          {
            id: "t1",
            content: "User authentication flow",
            priority: "high",
            assignee: "Minh Huynh",
            assigneeId: "u1",
            assigneeInitial: "M",
            dueDate: "25/04/2025",
            description:
              "Implement user authentication including login, register, and password reset functionality",
          },
          {
            id: "t2",
            content: "Database schema design",
            priority: "medium",
            assignee: "Team member",
            assigneeId: null,
            assigneeInitial: "T",
            dueDate: "28/04/2025",
            description: "Design database schema for the application",
          },
        ],
      },
      todo: {
        id: "todo",
        title: "To Do",
        tasks: [
          {
            id: "t3",
            content: "API documentation",
            priority: "medium",
            assignee: "Dang Ho",
            assigneeId: "u2",
            assigneeInitial: "D",
            dueDate: "30/04/2025",
            description: "Create API documentation for the backend services",
          },
          {
            id: "t4",
            content: "UI component library",
            priority: "low",
            assignee: "Tri Vu",
            assigneeId: "u3",
            assigneeInitial: "T",
            dueDate: "02/05/2025",
            description: "Develop a reusable UI component library",
          },
        ],
      },
      inProgress: {
        id: "inProgress",
        title: "In Progress",
        tasks: [
          {
            id: "t5",
            content: "Kanban Board Implementation",
            priority: "high",
            assignee: "Minh Huynh",
            assigneeId: "u1",
            assigneeInitial: "M",
            dueDate: "20/04/2025",
            description:
              "Implement drag and drop functionality for the Kanban board",
          },
        ],
      },
      review: {
        id: "review",
        title: "Đang xét duyệt",
        tasks: [
          {
            id: "t6",
            content: "Code review cho sprint 5",
            priority: "medium",
            assignee: "Khoa Nguyen",
            assigneeId: "u4",
            assigneeInitial: "K",
            dueDate: "17/04/2025",
            description:
              "Conduct code review for all features developed in sprint 5",
          },
        ],
      },
      done: {
        id: "done",
        title: "Hoàn thành",
        tasks: [
          {
            id: "t7",
            content: "Thiết lập môi trường dev",
            priority: "high",
            assignee: "Dat Chau",
            assigneeId: "u5",
            assigneeInitial: "D",
            dueDate: "15/04/2025",
            description:
              "Set up development environment including Docker containers",
          },
          {
            id: "t8",
            content: "Báo cáo tiến độ hàng tuần",
            priority: "low",
            assignee: "Kien Vo",
            assigneeId: "u6",
            assigneeInitial: "K",
            dueDate: "14/04/2025",
            description: "Generate weekly progress report",
          },
        ],
      },
    },
    board2: JSON.parse(JSON.stringify(defaultTemplates.default)),
    board3: JSON.parse(JSON.stringify(defaultTemplates.default)),
  });

  // Trạng thái cho các popup
  const [showCreateBoardForm, setShowCreateBoardForm] = useState(false);
  const [showAddMembersForm, setShowAddMembersForm] = useState(false);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // Debug để kiểm tra state
  useEffect(() => {
    console.log("Boards hiện tại:", boards);
  }, [boards]);

  useEffect(() => {
    console.log("Board tasks hiện tại:", boardTasks);
  }, [boardTasks]);

  // Xử lý khi chọn một bảng
  const handleBoardSelect = (boardId) => {
    if (boardId) {
      setActiveBoardId(boardId);
      setActiveView("kanban");
      setActiveTab("board");
      console.log("Đã chọn bảng:", boardId);
    } else {
      setActiveView("boardList");
      setActiveBoardId(null);
      console.log("Quay lại danh sách bảng");
    }
  };

  // Xử lý khi chọn một tab
  const handleTabSelect = (boardId, tab) => {
    setActiveBoardId(boardId);
    setActiveTab(tab);

    if (tab === "board") {
      setActiveView("kanban");
    } else if (tab === "sprints") {
      setActiveView("sprints");
    } else if (tab === "backlog") {
      setActiveView("backlog");
    } else if (tab === "reports") {
      setActiveView("reports");
    }

    console.log(`Đã chuyển sang tab ${tab} của bảng ${boardId}`);
  };

  // Tạo cấu trúc columns mới từ template
  const createColumnsFromTemplate = (templateType) => {
    // Kiểm tra loại template hợp lệ
    const validTemplate = ["default", "kanban", "scrum", "project"].includes(
      templateType
    )
      ? templateType
      : "default";

    // Copy từ template tương ứng để tránh tham chiếu
    return JSON.parse(JSON.stringify(defaultTemplates[validTemplate]));
  };

  // Xử lý tạo bảng mới
  const handleCreateBoard = () => {
    setShowCreateBoardForm(true);
  };

  // Tạo bảng thành công
  const handleBoardCreated = (boardData) => {
    const newBoardId = `board${Date.now()}`;

    // Lấy template đúng từ loại board đã chọn
    const templateType = boardData.templateType;

    // Tạo board mới
    const newBoard = {
      id: newBoardId,
      title: boardData.title,
      color: boardData.color,
      description: boardData.description,
      owner: `${user?.firstName || "Người"} ${user?.lastName || "dùng"}`,
      members: 1,
      template: templateType,
      lastModified: currentDate,
    };

    // Thêm board vào danh sách sử dụng functional update để đảm bảo dùng state mới nhất
    setBoards((prevBoards) => {
      console.log("Thêm bảng mới:", newBoard);
      return [...prevBoards, newBoard];
    });

    // Tạo cấu trúc tasks cho board mới
    setBoardTasks((prevBoardTasks) => {
      const newBoardTasks = {
        ...prevBoardTasks,
        [newBoardId]: createColumnsFromTemplate(templateType),
      };
      console.log("Cập nhật tasks cho bảng mới:", newBoardTasks);
      return newBoardTasks;
    });

    // Thêm người tạo vào danh sách thành viên
    setBoardMembers((prevBoardMembers) => {
      const updatedBoardMembers = {
        ...prevBoardMembers,
        [newBoardId]: [
          {
            id: user?.id || "current",
            name: `${user?.firstName || "Người"} ${user?.lastName || "dùng"}`,
            role: "Admin",
            avatar: `${(user?.firstName || "N")[0]}${
              (user?.lastName || "T")[0]
            }`,
            lastActive: currentDate,
          },
        ],
      };
      return updatedBoardMembers;
    });

    // Đóng form
    setShowCreateBoardForm(false);

    // THAY ĐỔI: Không chuyển đến board mới, mà vẫn ở dashboard
    // Bỏ đoạn code sau:
    // setTimeout(() => {
    //   handleBoardSelect(newBoardId);
    // }, 100);
  };

  // Xử lý thêm thành viên
  const handleAddMembers = () => {
    setShowAddMembersForm(true);
  };

  // Thêm thành viên thành công
  const handleMembersAdded = (newMembers, method) => {
    if (!activeBoardId) return;

    // Sử dụng functional update để đảm bảo có state mới nhất
    setBoardMembers((prevBoardMembers) => {
      // Lấy danh sách thành viên hiện tại của bảng
      const currentMembers = prevBoardMembers[activeBoardId] || [];
      // Lấy danh sách ID của thành viên hiện tại để kiểm tra
      const existingMemberIds = currentMembers.map((m) => m.id);

      let updatedMembers = [...currentMembers];

      if (method === "email") {
        // Xử lý thêm thành viên qua email
        console.log(
          `Đã gửi email mời đến: ${newMembers.map((m) => m.email).join(", ")}`
        );
        // Không thêm vào danh sách thành viên ngay vì cần chờ người dùng chấp nhận lời mời
      } else if (method === "users") {
        // Lọc ra các thành viên chưa có trong bảng để tránh thêm trùng lặp
        const newMembersList = newMembers
          .filter((user) => !existingMemberIds.includes(user.id))
          .map((user) => ({
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            role: "Member",
            lastActive: currentDate,
          }));

        if (newMembersList.length > 0) {
          updatedMembers = [...currentMembers, ...newMembersList];
        }
      } else if (method === "team") {
        // Trong thực tế sẽ xử lý thêm cả team
        console.log(`Đã thêm cả team ${newMembers.teamName} vào bảng`);
        // Xử lý thêm team sẽ phức tạp hơn, cần gọi API để lấy danh sách thành viên của team
      }

      return {
        ...prevBoardMembers,
        [activeBoardId]: updatedMembers,
      };
    });

    setShowAddMembersForm(false);
  };

  // Xử lý thêm công việc mới
  const handleAddTask = (columnId) => {
    setSelectedColumn(columnId);
    setShowAddTaskForm(true);
  };

  // Thêm công việc thành công
  const handleTaskAdded = (taskData) => {
    if (!activeBoardId || !selectedColumn) return;

    const newTask = {
      id: `t${Date.now()}`,
      content: taskData.title,
      priority: taskData.priority,
      assignee: taskData.assignee,
      assigneeId: taskData.assigneeId,
      assigneeInitial: taskData.assignee ? taskData.assignee[0] : "",
      dueDate: taskData.dueDate,
      description: taskData.description,
    };

    // Cập nhật danh sách tasks của board hiện tại
    setBoardTasks((prevBoardTasks) => {
      const updatedBoardData = { ...prevBoardTasks[activeBoardId] };
      updatedBoardData[selectedColumn].tasks.push(newTask);

      return {
        ...prevBoardTasks,
        [activeBoardId]: updatedBoardData,
      };
    });

    setShowAddTaskForm(false);
    setSelectedColumn(null);
  };

  // Xử lý khi click vào một task
  const handleTaskClick = (task, columnId) => {
    setSelectedTask(task);
    setSelectedColumn(columnId);
    setShowTaskDetailModal(true);
  };

  // Cập nhật task
  const handleTaskUpdated = (updatedTask) => {
    if (!activeBoardId || !selectedColumn) return;

    // Kiểm tra nếu task bị xóa
    if (updatedTask.deleted) {
      setBoardTasks((prevBoardTasks) => {
        const updatedBoardData = { ...prevBoardTasks[activeBoardId] };
        updatedBoardData[selectedColumn].tasks = updatedBoardData[
          selectedColumn
        ].tasks.filter((t) => t.id !== updatedTask.id);

        return {
          ...prevBoardTasks,
          [activeBoardId]: updatedBoardData,
        };
      });
    } else {
      // Cập nhật task trong danh sách
      setBoardTasks((prevBoardTasks) => {
        const updatedBoardData = { ...prevBoardTasks[activeBoardId] };
        const taskIndex = updatedBoardData[selectedColumn].tasks.findIndex(
          (t) => t.id === updatedTask.id
        );

        if (taskIndex !== -1) {
          updatedBoardData[selectedColumn].tasks[taskIndex] = updatedTask;
        }

        return {
          ...prevBoardTasks,
          [activeBoardId]: updatedBoardData,
        };
      });
    }

    setShowTaskDetailModal(false);
    setSelectedTask(null);
    setSelectedColumn(null);
  };

  // Xử lý khi di chuyển task giữa các cột
  const handleTaskMoved = (taskId, sourceColumnId, targetColumnId) => {
    if (!activeBoardId) return;

    setBoardTasks((prevBoardTasks) => {
      const updatedBoardData = { ...prevBoardTasks[activeBoardId] };

      // Tìm task trong cột nguồn
      const sourceColumn = updatedBoardData[sourceColumnId];
      const taskIndex = sourceColumn.tasks.findIndex((t) => t.id === taskId);

      if (taskIndex === -1) return prevBoardTasks;

      // Lấy task từ cột nguồn
      const task = sourceColumn.tasks[taskIndex];

      // Xóa task khỏi cột nguồn
      sourceColumn.tasks.splice(taskIndex, 1);

      // Thêm task vào cột đích
      updatedBoardData[targetColumnId].tasks.push(task);

      return {
        ...prevBoardTasks,
        [activeBoardId]: updatedBoardData,
      };
    });
  };

  // Hiển thị nội dung chính dựa vào activeView
  const renderContent = () => {
    switch (activeView) {
      case "boardList":
        return (
          <BoardList
            boards={boards}
            onBoardSelect={handleBoardSelect}
            onCreateBoard={handleCreateBoard}
          />
        );
      case "kanban":
        return (
          <KanbanBoard
            boardId={activeBoardId}
            columns={boardTasks[activeBoardId] || {}}
            onAddTask={handleAddTask}
            onTaskClick={handleTaskClick}
            onTaskMoved={handleTaskMoved}
          />
        );
      case "sprints":
        return (
          <div className="placeholder-view">
            <div className="placeholder-icon">🔄</div>
            <h3>Tính năng Sprints đang phát triển</h3>
            <p>
              Chức năng này đang được xây dựng và sẽ sớm được ra mắt. Bạn sẽ có
              thể quản lý các sprint, xem burndown chart và nhiều tính năng
              khác.
            </p>
          </div>
        );
      case "backlog":
        return (
          <div className="placeholder-view">
            <div className="placeholder-icon">📋</div>
            <h3>Tính năng Backlog đang phát triển</h3>
            <p>
              Chức năng này đang được xây dựng và sẽ sớm được ra mắt. Bạn sẽ có
              thể quản lý các task trong backlog, sắp xếp ưu tiên và chuẩn bị
              cho sprint.
            </p>
          </div>
        );
      case "reports":
        return (
          <div className="placeholder-view">
            <div className="placeholder-icon">📊</div>
            <h3>Tính năng Reports đang phát triển</h3>
            <p>
              Chức năng này đang được xây dựng và sẽ sớm được ra mắt. Bạn sẽ có
              thể xem các báo cáo, biểu đồ phân tích và thống kê về tiến độ dự
              án.
            </p>
          </div>
        );
      default:
        return (
          <BoardList
            boards={boards}
            onBoardSelect={handleBoardSelect}
            onCreateBoard={handleCreateBoard}
          />
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        activeBoardId={activeBoardId}
        boards={boards}
        onBoardSelect={handleBoardSelect}
        onTabSelect={handleTabSelect}
        onCreateBoard={handleCreateBoard}
      />

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <Header
          user={user}
          activeView={activeView}
          activeTab={activeTab}
          activeBoardId={activeBoardId}
          board={boards.find((b) => b.id === activeBoardId)}
          onTabSelect={handleTabSelect}
          onAddMembers={activeBoardId ? handleAddMembers : null}
        />

        {/* Main Content Area */}
        <div className="content-area">{renderContent()}</div>
      </div>

      {/* Popup Forms */}
      {showCreateBoardForm && (
        <CreateBoardForm
          onClose={() => setShowCreateBoardForm(false)}
          onBoardCreated={handleBoardCreated}
        />
      )}

      {showAddMembersForm && (
        <AddMembersForm
          boardId={activeBoardId}
          currentMembers={boardMembers[activeBoardId] || []}
          availableUsers={availableUsers}
          onClose={() => setShowAddMembersForm(false)}
          onAddMembers={handleMembersAdded}
        />
      )}

      {showAddTaskForm && (
        <AddTaskForm
          boardMembers={boardMembers[activeBoardId] || []}
          onClose={() => setShowAddTaskForm(false)}
          onSubmit={handleTaskAdded}
        />
      )}

      {showTaskDetailModal && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          boardMembers={boardMembers[activeBoardId] || []}
          onClose={() => setShowTaskDetailModal(false)}
          onTaskUpdate={handleTaskUpdated}
        />
      )}
    </div>
  );
};

export default DashboardPage;
