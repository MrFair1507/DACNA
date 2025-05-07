// // import React, { useState } from 'react';
// // import './AddTaskForm.css';

// // const AddTaskForm = ({ boardMembers, onClose, onSubmit }) => {
// //     const [taskData, setTaskData] = useState({
// //       title: '',
// //       assignee: '',
// //       assigneeId: null,
// //       dueDate: '',
// //       priority: 'medium',
// //       description: ''
// //     });

// //     const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

// //     const handleChange = (e) => {
// //       const { name, value } = e.target;
// //       setTaskData(prev => ({
// //         ...prev,
// //         [name]: value
// //       }));
// //     };

// //     const handlePriorityChange = (priority) => {
// //       setTaskData({
// //         ...taskData,
// //         priority
// //       });
// //     };

// //     const handleAssigneeSelect = (member) => {
// //       setTaskData({
// //         ...taskData,
// //         assignee: member.name,
// //         assigneeId: member.id
// //       });
// //       setShowAssigneeDropdown(false);
// //     };

// //     const handleSubmit = (e) => {
// //       e.preventDefault();
// //       onSubmit(taskData);
// //     };

// //     return (
// //       <div className="modal-overlay">
// //         <div className="modal-container">
// //           <div className="modal-header">
// //             <h3>Thêm thẻ mới</h3>
// //             <button className="close-btn" onClick={onClose}>×</button>
// //           </div>

// //           <form onSubmit={handleSubmit}>
// //             <div className="modal-body">
// //               <div className="form-group">
// //                 <label className="form-label">Tiêu đề thẻ</label>
// //                 <input
// //                   type="text"
// //                   className="form-control"
// //                   placeholder="Nhập tiêu đề thẻ"
// //                   name="title"
// //                   value={taskData.title}
// //                   onChange={handleChange}
// //                   required
// //                 />
// //               </div>

// //               <div className="form-group">
// //                 <label className="form-label">Người phụ trách</label>
// //                 <div className="assignee-selector">
// //                   <div
// //                     className="form-control assignee-display"
// //                     onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
// //                   >
// //                     {taskData.assignee || 'Chọn người phụ trách'}
// //                   </div>

// //                   {showAssigneeDropdown && (
// //                     <div className="assignee-dropdown">
// //                       {boardMembers.map(member => (
// //                         <div
// //                           key={member.id}
// //                           className="assignee-option"
// //                           onClick={() => handleAssigneeSelect(member)}
// //                         >
// //                           <div className="option-avatar">
// //                             <span>{member.avatar}</span>
// //                           </div>
// //                           <div className="option-name">{member.name}</div>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>

// //               <div className="form-row">
// //                 <div className="form-group half">
// //                   <label className="form-label">Ngày hết hạn</label>
// //                   <input
// //                     type="text"
// //                     className="form-control"
// //                     placeholder="VD: 25/04/2025"
// //                     name="dueDate"
// //                     value={taskData.dueDate}
// //                     onChange={handleChange}
// //                     required
// //                   />
// //                 </div>

// //                 <div className="form-group half">
// //                   <label className="form-label">Mức độ ưu tiên</label>
// //                   <div className="priority-options">
// //                     <div
// //                       className={`priority-option ${taskData.priority === 'high' ? 'selected' : ''}`}
// //                       onClick={() => handlePriorityChange('high')}
// //                     >
// //                       <span className="priority-badge priority-high">Cao</span>
// //                     </div>
// //                     <div
// //                       className={`priority-option ${taskData.priority === 'medium' ? 'selected' : ''}`}
// //                       onClick={() => handlePriorityChange('medium')}
// //                     >
// //                       <span className="priority-badge priority-medium">Trung bình</span>
// //                     </div>
// //                     <div
// //                       className={`priority-option ${taskData.priority === 'low' ? 'selected' : ''}`}
// //                       onClick={() => handlePriorityChange('low')}
// //                     >
// //                       <span className="priority-badge priority-low">Thấp</span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="form-group">
// //                 <label className="form-label">Mô tả</label>
// //                 <textarea
// //                   className="form-control"
// //                   rows="3"
// //                   placeholder="Nhập mô tả chi tiết cho thẻ"
// //                   name="description"
// //                   value={taskData.description}
// //                   onChange={handleChange}
// //                 ></textarea>
// //               </div>
// //             </div>

// //             <div className="modal-footer">
// //               <button
// //                 type="button"
// //                 className="cancel-btn"
// //                 onClick={onClose}
// //               >
// //                 Hủy
// //               </button>
// //               <button
// //                 type="submit"
// //                 className="submit-btn"
// //                 disabled={!taskData.title.trim() || !taskData.dueDate.trim()}
// //               >
// //                 Thêm thẻ
// //               </button>
// //             </div>
// //           </form>
// //         </div>
// //       </div>
// //     );
// //   };

// // export default AddTaskForm;
// // src/components/Board/AddTaskForm.jsx
// import React, { useState } from "react";
// import { useAuth } from "../../hooks/useAuth";
// import taskService from "../../services/taskService";
// import "./AddTaskForm.css";

// const AddTaskForm = ({
//   sprintId = null,
//   projectId = null,
//   boardMembers = [],
//   onClose,
//   onSubmit,
//   onError,
// }) => {
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [taskData, setTaskData] = useState({
//     task_title: "",
//     task_description: "",
//     assigned_to: null,
//     assignee: "",
//     due_date: "",
//     start_date: "",
//     priority: "Medium",
//     task_status: "Not Started",
//   });

//   const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTaskData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Xóa thông báo lỗi khi người dùng thay đổi dữ liệu
//     if (error) setError("");
//   };

//   const handlePriorityChange = (priority) => {
//     setTaskData({
//       ...taskData,
//       priority,
//     });
//   };

//   const handleAssigneeSelect = (member) => {
//     setTaskData({
//       ...taskData,
//       assigned_to: member.id,
//       assignee: member.name,
//     });
//     setShowAssigneeDropdown(false);
//   };

//   const handleDateChange = (e) => {
//     // Hỗ trợ định dạng ngày DD/MM/YYYY thành YYYY-MM-DD cho API
//     const { name, value } = e.target;

//     // Kiểm tra nếu đã đúng định dạng YYYY-MM-DD thì lưu trực tiếp
//     if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
//       setTaskData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//       return;
//     }

//     // Nếu là định dạng DD/MM/YYYY thì chuyển đổi
//     if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
//       const [day, month, year] = value.split("/");
//       const formattedDate = `${year}-${month}-${day}`;

//       setTaskData((prev) => ({
//         ...prev,
//         [name]: formattedDate,
//       }));
//     } else {
//       // Nếu không đúng định dạng thì lưu nguyên giá trị để validate sau
//       setTaskData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const validateForm = () => {
//     if (!taskData.task_title.trim()) {
//       setError("Vui lòng nhập tiêu đề công việc");
//       return false;
//     }

//     if (!taskData.due_date) {
//       setError("Vui lòng nhập ngày hết hạn");
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setIsLoading(true);

//     try {
//       // Chuẩn bị dữ liệu gửi lên API
//       const apiTaskData = {
//         sprint_id: sprintId,
//         project_id: projectId,
//         task_title: taskData.task_title,
//         task_description: taskData.task_description,
//         priority: taskData.priority,
//         start_date: taskData.start_date || null,
//         due_date: taskData.due_date,
//         task_status: taskData.task_status,
//         assigned_to: taskData.assigned_to,
//       };

//       // Gọi API tạo task
//       const result = await taskService.createTask(apiTaskData);

//       if (result.success) {
//         // Chuẩn bị dữ liệu trả về cho component cha
//         const createdTask = {
//           id: result.data.task_id,
//           title: taskData.task_title,
//           content: taskData.task_title,
//           description: taskData.task_description,
//           priority: taskData.priority.toLowerCase(),
//           assignee: taskData.assignee,
//           assigneeId: taskData.assigned_to,
//           assigneeInitial: taskData.assignee ? taskData.assignee[0] : "",
//           dueDate: taskData.due_date,
//           status: taskData.task_status,
//         };

//         // Gọi callback thành công
//         onSubmit(createdTask);
//       } else {
//         setError(result.error || "Có lỗi xảy ra khi tạo công việc");
//         if (onError) onError(result.error);
//       }
//     } catch (err) {
//       console.error("Error creating task:", err);
//       setError("Có lỗi xảy ra khi tạo công việc");
//       if (onError) onError("Có lỗi xảy ra khi tạo công việc");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-container">
//         <div className="modal-header">
//           <h3>Thêm thẻ mới</h3>
//           <button className="close-btn" onClick={onClose}>
//             ×
//           </button>
//         </div>

//         {error && (
//           <div className="error-message" style={{ margin: "0 20px" }}>
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="modal-body">
//             <div className="form-group">
//               <label className="form-label">Tiêu đề thẻ</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Nhập tiêu đề thẻ"
//                 name="task_title"
//                 value={taskData.task_title}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">Người phụ trách</label>
//               <div className="assignee-selector">
//                 <div
//                   className="form-control assignee-display"
//                   onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
//                 >
//                   {taskData.assignee || "Chọn người phụ trách"}
//                 </div>

//                 {showAssigneeDropdown && (
//                   <div className="assignee-dropdown">
//                     {boardMembers.map((member) => (
//                       <div
//                         key={member.id}
//                         className="assignee-option"
//                         onClick={() => handleAssigneeSelect(member)}
//                       >
//                         <div className="option-avatar">
//                           <span>{member.avatar}</span>
//                         </div>
//                         <div className="option-name">{member.name}</div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group half">
//                 <label className="form-label">Ngày bắt đầu</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="VD: 01/05/2025 hoặc 2025-05-01"
//                   name="start_date"
//                   value={taskData.start_date}
//                   onChange={handleDateChange}
//                 />
//               </div>

//               <div className="form-group half">
//                 <label className="form-label">Ngày hết hạn</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="VD: 25/04/2025 hoặc 2025-04-25"
//                   name="due_date"
//                   value={taskData.due_date}
//                   onChange={handleDateChange}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <label className="form-label">Mức độ ưu tiên</label>
//               <div className="priority-options">
//                 <div
//                   className={`priority-option ${
//                     taskData.priority === "High" ? "selected" : ""
//                   }`}
//                   onClick={() => handlePriorityChange("High")}
//                 >
//                   <span className="priority-badge priority-high">Cao</span>
//                 </div>
//                 <div
//                   className={`priority-option ${
//                     taskData.priority === "Medium" ? "selected" : ""
//                   }`}
//                   onClick={() => handlePriorityChange("Medium")}
//                 >
//                   <span className="priority-badge priority-medium">
//                     Trung bình
//                   </span>
//                 </div>
//                 <div
//                   className={`priority-option ${
//                     taskData.priority === "Low" ? "selected" : ""
//                   }`}
//                   onClick={() => handlePriorityChange("Low")}
//                 >
//                   <span className="priority-badge priority-low">Thấp</span>
//                 </div>
//               </div>
//             </div>

//             <div className="form-group">
//               <label className="form-label">Mô tả</label>
//               <textarea
//                 className="form-control"
//                 rows="3"
//                 placeholder="Nhập mô tả chi tiết cho thẻ"
//                 name="task_description"
//                 value={taskData.task_description}
//                 onChange={handleChange}
//               ></textarea>
//             </div>
//           </div>

//           <div className="modal-footer">
//             <button type="button" className="cancel-btn" onClick={onClose}>
//               Hủy
//             </button>
//             <button
//               type="submit"
//               className="submit-btn"
//               disabled={
//                 isLoading || !taskData.task_title.trim() || !taskData.due_date
//               }
//             >
//               {isLoading ? "Đang xử lý..." : "Thêm thẻ"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddTaskForm;
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import taskService from "../../services/taskService";
import "./AddTaskForm.css";

const AddTaskForm = ({
  sprintId = null,
  projectId = null,
  projectMembers = [],
  onClose,
  onSubmit,
  onError,
}) => {
  // eslint-disable-next-line
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [taskData, setTaskData] = useState({
    task_title: "",
    task_description: "",
    assigned_to: null,
    assignee: "",
    due_date: "",
    start_date: "",
    priority: "Medium",
    task_status: "Not Started",
  });

  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handlePriorityChange = (priority) => {
    setTaskData({
      ...taskData,
      priority,
    });
  };

  const handleAssigneeSelect = (member) => {
    setTaskData({
      ...taskData,
      assigned_to: member.id,
      assignee: member.name,
    });
    setShowAssigneeDropdown(false);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      setTaskData((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [day, month, year] = value.split("/");
      const formattedDate = `${year}-${month}-${day}`;

      setTaskData((prev) => ({
        ...prev,
        [name]: formattedDate,
      }));
    } else {
      setTaskData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    if (!taskData.task_title.trim()) {
      setError("Vui lòng nhập tiêu đề công việc");
      return false;
    }

    if (!taskData.due_date) {
      setError("Vui lòng nhập ngày hết hạn");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const apiTaskData = {
        sprint_id: sprintId,
        project_id: projectId,
        task_title: taskData.task_title,
        task_description: taskData.task_description,
        priority: taskData.priority,
        start_date: taskData.start_date || null,
        due_date: taskData.due_date,
        task_status: taskData.task_status,
        assigned_to: taskData.assigned_to,
      };

      const result = await taskService.createTask(apiTaskData);

      if (result.success) {
        const createdTask = {
          id: result.data.task_id,
          title: taskData.task_title,
          content: taskData.task_title,
          description: taskData.task_description,
          priority: taskData.priority.toLowerCase(),
          assignee: taskData.assignee,
          assigneeId: taskData.assigned_to,
          assigneeInitial: taskData.assignee ? taskData.assignee[0] : "",
          dueDate: taskData.due_date,
          status: taskData.task_status,
        };

        onSubmit(createdTask);
      } else {
        setError(result.error || "Có lỗi xảy ra khi tạo công việc");
        if (onError) onError(result.error);
      }
    } catch (err) {
      console.error("Error creating task:", err);
      setError("Có lỗi xảy ra khi tạo công việc");
      if (onError) onError("Có lỗi xảy ra khi tạo công việc");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Thêm thẻ mới</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message" style={{ margin: "0 20px" }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Tiêu đề thẻ</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập tiêu đề thẻ"
                name="task_title"
                value={taskData.task_title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Người phụ trách</label>
              <div className="assignee-selector">
                <div
                  className="form-control assignee-display"
                  onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                >
                  {taskData.assignee || "Chọn người phụ trách"}
                </div>

                {showAssigneeDropdown && (
                  <div className="assignee-dropdown">
                    {projectMembers.map((member) => (
                      <div
                        key={member.id}
                        className="assignee-option"
                        onClick={() => handleAssigneeSelect(member)}
                      >
                        <div className="option-avatar"><span>{member.avatar}</span></div>
                        <div className="option-name">{member.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label className="form-label">Ngày bắt đầu</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="VD: 01/05/2025 hoặc 2025-05-01"
                  name="start_date"
                  value={taskData.start_date}
                  onChange={handleDateChange}
                />
              </div>

              <div className="form-group half">
                <label className="form-label">Ngày hết hạn</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="VD: 25/04/2025 hoặc 2025-04-25"
                  name="due_date"
                  value={taskData.due_date}
                  onChange={handleDateChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mức độ ưu tiên</label>
              <div className="priority-options">
                {["High", "Medium", "Low"].map((level) => (
                  <div
                    key={level}
                    className={`priority-option ${taskData.priority === level ? "selected" : ""}`}
                    onClick={() => handlePriorityChange(level)}
                  >
                    <span className={`priority-badge priority-${level.toLowerCase()}`}>
                      {level === "High" ? "Cao" : level === "Medium" ? "Trung bình" : "Thấp"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Nhập mô tả chi tiết cho thẻ"
                name="task_description"
                value={taskData.task_description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Hủy</button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading || !taskData.task_title.trim() || !taskData.due_date}
            >
              {isLoading ? "Đang xử lý..." : "Thêm thẻ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskForm;
