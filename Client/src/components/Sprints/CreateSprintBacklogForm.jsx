// import React, { useState } from "react";
// import "./CreateSprintBacklogForm.css";

// const CreateSprintBacklogForm = ({ sprint, productBacklogs, onClose, onSubmit }) => {
//   const [selectedIds, setSelectedIds] = useState([]);

//   const toggleSelect = (id) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const handleSubmit = () => {
//     const selectedItems = productBacklogs.filter((item) => selectedIds.includes(item.id));
//     onSubmit(selectedItems);
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-container">
//         <div className="modal-header">
//           <h3>Tạo Sprint Backlog cho: {sprint.name}</h3>
//           <button className="close-btn" onClick={onClose}>×</button>
//         </div>

//         <div className="modal-body">
//           <p>Chọn các Product Backlog để thêm vào Sprint:</p>
//           <ol className="backlog-list">
//             {productBacklogs.map((item) => {
//               const selected = selectedIds.includes(item.id);
//               return (
//                 <li
//                   key={item.id}
//                   className={`backlog-item ${selected ? "selected" : ""}`}
//                   onClick={() => toggleSelect(item.id)}
//                 >
//                   <div className="tick">{selected && "✔"}</div>
//                   <div className="backlog-text">
//                     <strong>{item.title}</strong>
//                     <div className="description">{item.description}</div>
//                   </div>
//                 </li>
//               );
//             })}
//           </ol>
//         </div>

//         <div className="modal-footer">
//           <button className="cancel-btn" onClick={onClose}>Hủy</button>
//           <button className="submit-btn" onClick={handleSubmit} disabled={selectedIds.length === 0}>
//             Thêm vào Sprint
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateSprintBacklogForm;
// import React, { useState } from "react";
// import "./CreateSprintBacklogForm.css";
// import SprintBacklogList from "../SprintBacklog/AddSprintBacklog";

// const CreateSprintBacklogForm = ({
//   sprint,
//   productBacklogs,
//   onClose,
//   onSubmit,
//   projectId,
//   projectMembers,
//   onTaskCreated
// }) => {
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [tab, setTab] = useState("add"); // "add" | "view"

//   const toggleSelect = (id) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const handleSubmit = () => {
//     const selectedItems = productBacklogs.filter((item) =>
//       selectedIds.includes(item.id)
//     );
//     onSubmit(selectedItems);
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-container">
//         <div className="modal-header">
//           <div className="modal-tabs">
//             <button
//               className={tab === "add" ? "active-tab" : ""}
//               onClick={() => setTab("add")}
//             >
//               ➕ Thêm backlog
//             </button>
//             <button
//               className={tab === "view" ? "active-tab" : ""}
//               onClick={() => setTab("view")}
//             >
//               📋 Xem backlog
//             </button>
//           </div>
//           <button className="close-btn" onClick={onClose}>×</button>
//         </div>

//         <div className="modal-body">
//           {tab === "add" && (
//             <>
//               <p>Chọn các Product Backlog để thêm vào Sprint:</p>
//               <ol className="backlog-list">
//                 {productBacklogs.map((item) => {
//                   const selected = selectedIds.includes(item.id);
//                   return (
//                     <li
//                       key={item.id}
//                       className={`backlog-item ${selected ? "selected" : ""}`}
//                       onClick={() => toggleSelect(item.id)}
//                     >
//                       <div className="tick">{selected && "✔"}</div>
//                       <div className="backlog-text">
//                         <strong>{item.title}</strong>
//                         <div className="description">{item.description}</div>
//                       </div>
//                     </li>
//                   );
//                 })}
//               </ol>
//             </>
//           )}

//           {tab === "view" && (
//             <SprintBacklogList
//               sprintId={sprint.id}
//               projectId={projectId}
//               projectMembers={projectMembers}
//               onTaskCreated={onTaskCreated}
//             />
//           )}
//         </div>

//         {tab === "add" && (
//           <div className="modal-footer">
//             <button className="cancel-btn" onClick={onClose}>Hủy</button>
//             <button
//               className="submit-btn"
//               onClick={handleSubmit}
//               disabled={selectedIds.length === 0}
//             >
//               Thêm vào Sprint
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CreateSprintBacklogForm;
import React, { useState } from "react";
import AddTaskForm from "../Project/AddTaskForm"; // đảm bảo đúng path
import "./CreateSprintBacklogForm.css";

const CreateSprintBacklogForm = ({
  sprint,
  productBacklogs,
  onClose,
  onSubmit,
  projectId,
  projectMembers,
  onTaskCreated,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [tab, setTab] = useState("add"); // "add" | "view"
  const [openTaskBacklogId, setOpenTaskBacklogId] = useState(null);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const selectedItems = productBacklogs.filter((item) =>
      selectedIds.includes(item.id)
    );
    onSubmit(selectedItems);
  };

  const selectedBacklogs = productBacklogs.filter((item) =>
    selectedIds.includes(item.id)
  );

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-tabs">
            <button
              className={tab === "add" ? "active-tab" : ""}
              onClick={() => setTab("add")}
            >
              ➕ Thêm backlog
            </button>
            <button
              className={tab === "view" ? "active-tab" : ""}
              onClick={() => setTab("view")}
            >
              📋 Xem backlog
            </button>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {tab === "add" && (
            <>
              <p>Chọn các Product Backlog để thêm vào Sprint:</p>
              <ol className="backlog-list">
                {productBacklogs.map((item) => {
                  const selected = selectedIds.includes(item.id);
                  return (
                    <li
                      key={item.id}
                      className={`backlog-item ${selected ? "selected" : ""}`}
                      onClick={() => toggleSelect(item.id)}
                    >
                      <div className="tick">{selected && "✔"}</div>
                      <div className="backlog-text">
                        <strong>{item.title}</strong>
                        <div className="description">{item.description}</div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </>
          )}

          {tab === "view" && (
            <div className="sprint-backlog-list">
              {selectedBacklogs.length === 0 ? (
                <p style={{ color: "#aaa", marginTop: 16 }}>
                  ⚠️ Bạn chưa chọn backlog nào. Vui lòng chọn trong tab “Thêm backlog”.
                </p>
              ) : (
                selectedBacklogs.map((item) => (
                  <div key={item.id} className="sprint-backlog-card">
                    <div className="card-header">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>

                    <div className="card-footer">
                      <button onClick={() => setOpenTaskBacklogId(item.id)}>
                        + Tạo Task
                      </button>
                    </div>

                    {openTaskBacklogId === item.id && (
                      <AddTaskForm
                        sprintId={sprint.id}
                        projectId={projectId}
                        sprintBacklogId={item.id}
                        projectMembers={projectMembers}
                        onClose={() => setOpenTaskBacklogId(null)}
                        onSubmit={(task) => {
                          onTaskCreated?.(task);
                          setOpenTaskBacklogId(null);
                        }}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {tab === "add" && (
          <div className="modal-footer">
            <button className="cancel-btn" onClick={onClose}>Hủy</button>
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={selectedIds.length === 0}
            >
              Thêm vào Sprint
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateSprintBacklogForm;
