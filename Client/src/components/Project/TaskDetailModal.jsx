// import React, { useState } from 'react';
// import './TaskDetailModal.css';

// const TaskDetailModal = ({ task, boardMembers, onClose, onTaskUpdate }) => {
//     const [editMode, setEditMode] = useState(false);
//     const [taskData, setTaskData] = useState({
//       ...task
//     });
//     const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

//     const getPriorityClass = (priority) => {
//       switch(priority) {
//         case 'high':
//           return 'priority-high';
//         case 'medium':
//           return 'priority-medium';
//         case 'low':
//           return 'priority-low';
//         default:
//           return '';
//       }
//     };

//     const getPriorityText = (priority) => {
//       switch(priority) {
//         case 'high':
//           return 'Cao';
//         case 'medium':
//           return 'Trung bình';
//         case 'low':
//           return 'Thấp';
//         default:
//           return '';
//       }
//     };

//     const handleChange = (e) => {
//       const { name, value } = e.target;
//       setTaskData({
//         ...taskData,
//         [name]: value
//       });
//     };

//     const handlePriorityChange = (priority) => {
//       setTaskData({
//         ...taskData,
//         priority
//       });
//     };

//     const handleAssigneeSelect = (member) => {
//       setTaskData({
//         ...taskData,
//         assignee: member.name,
//         assigneeId: member.id,
//         assigneeInitial: member.avatar
//       });
//       setShowAssigneeDropdown(false);
//     };

//     const handleSave = () => {
//       onTaskUpdate(taskData);
//     };

//     const handleDelete = () => {
//       // Trong thực tế sẽ xác nhận trước khi xóa
//       onTaskUpdate({ ...taskData, deleted: true });
//     };

//     return (
//       <div className="modal-overlay">
//         <div className="modal-container task-detail-modal">
//           <div className="modal-header">
//             <h3>Chi tiết công việc</h3>
//             <button className="close-btn" onClick={onClose}>×</button>
//           </div>

//           <div className="modal-body">
//             {editMode ? (
//               // Chế độ chỉnh sửa
//               <>
//                 <div className="form-group">
//                   <label className="form-label">Tiêu đề</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="content"
//                     value={taskData.content}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Mô tả</label>
//                   <textarea
//                     className="form-control"
//                     rows="3"
//                     name="description"
//                     value={taskData.description}
//                     onChange={handleChange}
//                   ></textarea>
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group half">
//                     <label className="form-label">Người phụ trách</label>
//                     <div className="assignee-selector">
//                       <div
//                         className="form-control assignee-display"
//                         onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
//                       >
//                         {taskData.assignee || 'Chọn người phụ trách'}
//                       </div>

//                       {showAssigneeDropdown && (
//                         <div className="assignee-dropdown">
//                           {boardMembers.map(member => (
//                             <div
//                               key={member.id}
//                               className="assignee-option"
//                               onClick={() => handleAssigneeSelect(member)}
//                             >
//                               <div className="option-avatar">
//                                 <span>{member.avatar}</span>
//                               </div>
//                               <div className="option-name">{member.name}</div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   <div className="form-group half">
//                     <label className="form-label">Ngày hết hạn</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name="dueDate"
//                       value={taskData.dueDate}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Mức độ ưu tiên</label>
//                   <div className="priority-options">
//                     <div
//                       className={`priority-option ${taskData.priority === 'high' ? 'selected' : ''}`}
//                       onClick={() => handlePriorityChange('high')}
//                     >
//                       <span className="priority-badge priority-high">Cao</span>
//                     </div>
//                     <div
//                       className={`priority-option ${taskData.priority === 'medium' ? 'selected' : ''}`}
//                       onClick={() => handlePriorityChange('medium')}
//                     >
//                       <span className="priority-badge priority-medium">Trung bình</span>
//                     </div>
//                     <div
//                       className={`priority-option ${taskData.priority === 'low' ? 'selected' : ''}`}
//                       onClick={() => handlePriorityChange('low')}
//                     >
//                       <span className="priority-badge priority-low">Thấp</span>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               // Chế độ xem
//               <>
//                 <div className="task-detail-title">
//                   <h2>{task.content}</h2>
//                 </div>

//                 <div className="task-detail-meta">
//                   <div className="detail-group">
//                     <label>Người phụ trách</label>
//                     <div className="assignee-info">
//                       <div className="assignee-avatar">
//                         <span>{task.assigneeInitial}</span>
//                       </div>
//                       <span>{task.assignee}</span>
//                     </div>
//                   </div>

//                   <div className="detail-group">
//                     <label>Mức độ ưu tiên</label>
//                     <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
//                       {getPriorityText(task.priority)}
//                     </span>
//                   </div>

//                   <div className="detail-group">
//                     <label>Ngày hết hạn</label>
//                     <span className="due-date">{task.dueDate}</span>
//                   </div>
//                 </div>

//                 <div className="task-detail-description">
//                   <label>Mô tả</label>
//                   <p>{task.description || 'Chưa có mô tả chi tiết.'}</p>
//                 </div>

//                 <div className="task-detail-actions">
//                   <button className="action-btn add-comment-btn">
//                     <i className="icon-comment">💬</i>
//                     <span>Thêm bình luận</span>
//                   </button>

//                   <button className="action-btn add-checklist-btn">
//                     <i className="icon-checklist">✓</i>
//                     <span>Thêm checklist</span>
//                   </button>

//                   <button
//                     className="action-btn assign-user-btn"
//                     onClick={() => {
//                       setEditMode(true);
//                       setShowAssigneeDropdown(true);
//                     }}
//                   >
//                     <i className="icon-user">👤</i>
//                     <span>Gán người phụ trách</span>
//                   </button>
//                 </div>

//                 <div className="task-detail-activity">
//                   <label>Hoạt động</label>
//                   <div className="activity-empty">
//                     <p>Chưa có hoạt động nào.</p>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>

//           <div className="modal-footer">
//             {editMode ? (
//               <>
//                 <button
//                   className="cancel-btn"
//                   onClick={() => {
//                     setTaskData({...task});
//                     setEditMode(false);
//                   }}
//                 >
//                   Hủy
//                 </button>
//                 <button
//                   className="save-btn"
//                   onClick={handleSave}
//                 >
//                   Lưu thay đổi
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button
//                   className="delete-btn"
//                   onClick={handleDelete}
//                 >
//                   <i className="icon-delete">🗑️</i>
//                   <span>Xóa thẻ</span>
//                 </button>
//                 <button
//                   className="edit-btn"
//                   onClick={() => setEditMode(true)}
//                 >
//                   <i className="icon-edit">✏️</i>
//                   <span>Chỉnh sửa</span>
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

// export default TaskDetailModal;

// src/components/Board/TaskDetailModal.jsx
// import React, { useState, useEffect } from "react";
// import { useAuth } from "../../hooks/useAuth";
// import taskService from "../../services/taskService";
// import "./TaskDetailModal.css";

// const TaskDetailModal = ({ task, boardMembers, onClose, onTaskUpdate }) => {
//   const { user } = useAuth();
//   const [editMode, setEditMode] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");

//   const [taskData, setTaskData] = useState({
//     ...task,
//     task_title: task.content || task.title,
//     task_description: task.description || "",
//     priority: task.priority || "medium",
//     due_date: task.dueDate || "",
//     start_date: task.startDate || "",
//     status: task.status || "Not Started",
//   });

//   // Lấy thêm thông tin chi tiết từ API khi mở modal
//   useEffect(() => {
//     const fetchTaskDetails = async () => {
//       if (task.id) {
//         try {
//           const result = await taskService.getTaskById(task.id);
//           if (result.success && result.data) {
//             // Cập nhật thông tin task từ API
//             setComments(result.data.comments || []);

//             // Cập nhật taskData với thông tin từ API nếu có
//             setTaskData((prevData) => ({
//               ...prevData,
//               ...result.data,
//               task_title: result.data.task_title || prevData.task_title,
//               task_description:
//                 result.data.task_description || prevData.task_description,
//               priority:
//                 result.data.priority?.toLowerCase() || prevData.priority,
//               due_date: result.data.due_date || prevData.due_date,
//               start_date: result.data.start_date || prevData.start_date,
//               status: result.data.task_status || prevData.status,
//             }));
//           }
//         } catch (err) {
//           console.error("Error fetching task details:", err);
//         }
//       }
//     };

//     fetchTaskDetails();
//   }, [task.id]);

//   const getPriorityClass = (priority) => {
//     switch (priority) {
//       case "high":
//       case "High":
//         return "priority-high";
//       case "medium":
//       case "Medium":
//         return "priority-medium";
//       case "low":
//       case "Low":
//         return "priority-low";
//       default:
//         return "";
//     }
//   };

//   const getPriorityText = (priority) => {
//     switch (priority) {
//       case "high":
//       case "High":
//         return "Cao";
//       case "medium":
//       case "Medium":
//         return "Trung bình";
//       case "low":
//       case "Low":
//         return "Thấp";
//       default:
//         return "";
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTaskData({
//       ...taskData,
//       [name]: value,
//     });

//     // Xóa lỗi khi người dùng thay đổi dữ liệu
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
//       assignee: member.name,
//       assigneeId: member.id,
//       assigneeInitial: member.avatar,
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
//     if (!taskData.task_title?.trim()) {
//       setError("Vui lòng nhập tiêu đề công việc");
//       return false;
//     }

//     if (!taskData.due_date) {
//       setError("Vui lòng nhập ngày hết hạn");
//       return false;
//     }

//     return true;
//   };

//   const handleSave = async () => {
//     if (!validateForm()) return;

//     setIsLoading(true);

//     try {
//       // Chuẩn bị dữ liệu cho API
//       const apiTaskData = {
//         task_title: taskData.task_title,
//         task_description: taskData.task_description,
//         task_status: taskData.status,
//         priority:
//           taskData.priority.charAt(0).toUpperCase() +
//           taskData.priority.slice(1), // Capitalize
//         start_date: taskData.start_date || null,
//         due_date: taskData.due_date,
//       };

//       // Gọi API để cập nhật
//       const result = await taskService.updateTask(task.id, apiTaskData);

//       if (result.success) {
//         // Nếu có thay đổi người phụ trách
//         if (taskData.assigneeId !== task.assigneeId) {
//           // Gọi API phân công nếu có người được chọn
//           if (taskData.assigneeId) {
//             await taskService.assignTask(task.id, taskData.assigneeId);
//           }
//           // TODO: Xử lý hủy phân công nếu cần
//         }

//         // Chuẩn bị dữ liệu cập nhật cho component cha
//         const updatedTask = {
//           ...task,
//           id: task.id,
//           content: taskData.task_title,
//           description: taskData.task_description,
//           priority: taskData.priority,
//           assignee: taskData.assignee,
//           assigneeId: taskData.assigneeId,
//           assigneeInitial: taskData.assigneeInitial,
//           dueDate: taskData.due_date,
//           startDate: taskData.start_date,
//           status: taskData.status,
//         };

//         // Báo thành công và đóng modal
//         onTaskUpdate(updatedTask);
//       } else {
//         setError(result.error || "Không thể cập nhật công việc");
//       }
//     } catch (err) {
//       console.error("Error updating task:", err);
//       setError("Đã xảy ra lỗi khi cập nhật công việc");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (window.confirm("Bạn có chắc chắn muốn xóa công việc này không?")) {
//       setIsLoading(true);

//       try {
//         const result = await taskService.deleteTask(task.id);

//         if (result.success) {
//           // Báo với component cha là đã xóa
//           onTaskUpdate({
//             ...task,
//             deleted: true,
//           });
//         } else {
//           setError(result.error || "Không thể xóa công việc");
//         }
//       } catch (err) {
//         console.error("Error deleting task:", err);
//         setError("Đã xảy ra lỗi khi xóa công việc");
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   // Xử lý thêm bình luận mới
//   const handleAddComment = async () => {
//     if (!newComment.trim()) return;

//     try {
//       // TODO: Implement API call to add comment
//       // const result = await commentsService.addComment(task.id, newComment);

//       // Tạm thời thêm trực tiếp vào state local
//       const tempComment = {
//         comment_id: `temp-${Date.now()}`,
//         task_id: task.id,
//         user_id: user?.id,
//         content: newComment,
//         created_at: new Date().toISOString(),
//         full_name: user?.fullName || "Người dùng",
//         avatar_url: null,
//       };

//       setComments([tempComment, ...comments]);
//       setNewComment("");
//     } catch (err) {
//       console.error("Error adding comment:", err);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-container task-detail-modal">
//         <div className="modal-header">
//           <h3>Chi tiết công việc</h3>
//           <button className="close-btn" onClick={onClose}>
//             ×
//           </button>
//         </div>

//         {error && (
//           <div className="error-message" style={{ margin: "0 20px" }}>
//             {error}
//           </div>
//         )}

//         <div className="modal-body">
//           {editMode ? (
//             // Chế độ chỉnh sửa
//             <>
//               <div className="form-group">
//                 <label className="form-label">Tiêu đề</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   name="task_title"
//                   value={taskData.task_title}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="form-group">
//                 <label className="form-label">Mô tả</label>
//                 <textarea
//                   className="form-control"
//                   rows="3"
//                   name="task_description"
//                   value={taskData.task_description}
//                   onChange={handleChange}
//                 ></textarea>
//               </div>

//               <div className="form-row">
//                 <div className="form-group half">
//                   <label className="form-label">Người phụ trách</label>
//                   <div className="assignee-selector">
//                     <div
//                       className="form-control assignee-display"
//                       onClick={() =>
//                         setShowAssigneeDropdown(!showAssigneeDropdown)
//                       }
//                     >
//                       {taskData.assignee || "Chọn người phụ trách"}
//                     </div>

//                     {showAssigneeDropdown && (
//                       <div className="assignee-dropdown">
//                         {boardMembers.map((member) => (
//                           <div
//                             key={member.id}
//                             className="assignee-option"
//                             onClick={() => handleAssigneeSelect(member)}
//                           >
//                             <div className="option-avatar">
//                               <span>{member.avatar}</span>
//                             </div>
//                             <div className="option-name">{member.name}</div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="form-group half">
//                   <label className="form-label">Ngày hết hạn</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="due_date"
//                     value={taskData.due_date}
//                     onChange={handleDateChange}
//                   />
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label className="form-label">Mức độ ưu tiên</label>
//                 <div className="priority-options">
//                   <div
//                     className={`priority-option ${
//                       taskData.priority === "high" ? "selected" : ""
//                     }`}
//                     onClick={() => handlePriorityChange("high")}
//                   >
//                     <span className="priority-badge priority-high">Cao</span>
//                   </div>
//                   <div
//                     className={`priority-option ${
//                       taskData.priority === "medium" ? "selected" : ""
//                     }`}
//                     onClick={() => handlePriorityChange("medium")}
//                   >
//                     <span className="priority-badge priority-medium">
//                       Trung bình
//                     </span>
//                   </div>
//                   <div
//                     className={`priority-option ${
//                       taskData.priority === "low" ? "selected" : ""
//                     }`}
//                     onClick={() => handlePriorityChange("low")}
//                   >
//                     <span className="priority-badge priority-low">Thấp</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label className="form-label">Trạng thái</label>
//                 <select
//                   className="form-control"
//                   name="status"
//                   value={taskData.status}
//                   onChange={handleChange}
//                 >
//                   <option value="Not Started">Chưa bắt đầu</option>
//                   <option value="In Progress">Đang thực hiện</option>
//                   <option value="Review">Đang xem xét</option>
//                   <option value="Completed">Hoàn thành</option>
//                 </select>
//               </div>
//             </>
//           ) : (
//             // Chế độ xem
//             <>
//               <div className="task-detail-title">
//                 <h2>{taskData.task_title}</h2>
//               </div>

//               <div className="task-detail-meta">
//                 <div className="detail-group">
//                   <label>Người phụ trách</label>
//                   <div className="assignee-info">
//                     {taskData.assignee ? (
//                       <>
//                         <div className="assignee-avatar">
//                           <span>{taskData.assigneeInitial}</span>
//                         </div>
//                         <span>{taskData.assignee}</span>
//                       </>
//                     ) : (
//                       <span className="not-assigned">Chưa phân công</span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="detail-group">
//                   <label>Mức độ ưu tiên</label>
//                   <span
//                     className={`priority-badge ${getPriorityClass(
//                       taskData.priority
//                     )}`}
//                   >
//                     {getPriorityText(taskData.priority)}
//                   </span>
//                 </div>

//                 <div className="detail-group">
//                   <label>Ngày hết hạn</label>
//                   <span className="due-date">{taskData.due_date}</span>
//                 </div>

//                 <div className="detail-group">
//                   <label>Trạng thái</label>
//                   <span className="status-text">{taskData.status}</span>
//                 </div>
//               </div>

//               <div className="task-detail-description">
//                 <label>Mô tả</label>
//                 <p>{taskData.task_description || "Chưa có mô tả chi tiết."}</p>
//               </div>

//               <div className="task-comments-section">
//                 <label>Bình luận</label>

//                 <div className="comment-form">
//                   <textarea
//                     className="form-control"
//                     rows="2"
//                     placeholder="Thêm bình luận..."
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                   ></textarea>
//                   <button
//                     className="add-comment-btn"
//                     onClick={handleAddComment}
//                     disabled={!newComment.trim()}
//                   >
//                     Gửi
//                   </button>
//                 </div>

//                 <div className="comments-list">
//                   {comments.length > 0 ? (
//                     comments.map((comment) => (
//                       <div key={comment.comment_id} className="comment-item">
//                         <div className="comment-avatar">
//                           <span>{comment.full_name?.[0] || "U"}</span>
//                         </div>
//                         <div className="comment-content">
//                           <div className="comment-header">
//                             <span className="comment-author">
//                               {comment.full_name}
//                             </span>
//                             <span className="comment-date">
//                               {new Date(comment.created_at).toLocaleDateString(
//                                 "vi-VN"
//                               )}
//                             </span>
//                           </div>
//                           <p className="comment-text">{comment.content}</p>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="no-comments">
//                       <p>Chưa có bình luận nào.</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         <div className="modal-footer">
//           {editMode ? (
//             <>
//               <button
//                 className="cancel-btn"
//                 onClick={() => {
//                   setTaskData({ ...task });
//                   setEditMode(false);
//                 }}
//                 disabled={isLoading}
//               >
//                 Hủy
//               </button>
//               <button
//                 className="save-btn"
//                 onClick={handleSave}
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
//               </button>
//             </>
//           ) : (
//             <>
//               <button
//                 className="delete-btn"
//                 onClick={handleDelete}
//                 disabled={isLoading}
//               >
//                 <i className="icon-delete">🗑️</i>
//                 <span>{isLoading ? "Đang xử lý..." : "Xóa thẻ"}</span>
//               </button>
//               <button
//                 className="edit-btn"
//                 onClick={() => setEditMode(true)}
//                 disabled={isLoading}
//               >
//                 <i className="icon-edit">✏️</i>
//                 <span>Chỉnh sửa</span>
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskDetailModal;

import React, { useState, useEffect } from 'react';
import './TaskDetailModal.css';

const TaskDetailModal = ({ task, projectMembers, onClose, onTaskUpdate }) => {
  const [editedTask, setEditedTask] = useState({ ...task });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setEditedTask({ ...task });
    setIsEditing(false);
    setError('');
  }, [task]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAssigneeChange = (e) => {
    const memberId = e.target.value;
    const member = projectMembers.find(m => m.id === memberId);
    setEditedTask((prev) => ({
      ...prev,
      assignee: member?.name || '',
      assigneeId: member?.id || '',
      assigneeInitial: member?.name ? member.name[0] : ''
    }));
  };

  const handlePriorityChange = (level) => {
    setEditedTask((prev) => ({
      ...prev,
      priority: level
    }));
  };

  const handleSave = () => {
    if (!editedTask.title?.trim()) {
      setError('Tiêu đề không được để trống');
      return;
    }

    onTaskUpdate(editedTask);
  };

  const handleDelete = () => {
    onTaskUpdate({ ...editedTask, deleted: true });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h3>Chi tiết công việc</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="modal-body">
          {!isEditing ? (
            <>
              <h4>{task.title || task.content}</h4>
              <p><strong>Người phụ trách:</strong> {task.assignee || 'Chưa chỉ định'}</p>
              <p><strong>Hạn chót:</strong> {task.dueDate}</p>
              <p><strong>Mức độ ưu tiên:</strong> {task.priority}</p>
              <p><strong>Mô tả:</strong></p>
              <p>{task.description || 'Không có mô tả'}</p>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  value={editedTask.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Người phụ trách</label>
                <select value={editedTask.assigneeId || ''} onChange={handleAssigneeChange}>
                  <option value="">-- Chọn người phụ trách --</option>
                  {projectMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Hạn chót</label>
                <input
                  type="text"
                  name="dueDate"
                  value={editedTask.dueDate}
                  onChange={handleInputChange}
                  placeholder="VD: 25/04/2025"
                />
              </div>

              <div className="form-group">
                <label>Mức độ ưu tiên</label>
                <div className="priority-options">
                  {['high', 'medium', 'low'].map(level => (
                    <span
                      key={level}
                      className={`priority-badge priority-${level} ${editedTask.priority === level ? 'selected' : ''}`}
                      onClick={() => handlePriorityChange(level)}
                    >
                      {level === 'high' ? 'Cao' : level === 'medium' ? 'Trung bình' : 'Thấp'}
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  name="description"
                  value={editedTask.description}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          {isEditing ? (
            <>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Hủy</button>
              <button className="submit-btn" onClick={handleSave}>Lưu</button>
            </>
          ) : (
            <>
              <button className="cancel-btn" onClick={handleDelete}>Xóa</button>
              <button className="submit-btn" onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;

