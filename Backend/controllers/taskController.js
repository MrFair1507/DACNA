const db = require('../models/db'); // Kết nối mysql2

// GET: Lấy danh sách task theo backlog
exports.getTasksByBacklog = async (req, res) => {
  try {
    const [tasks] = await db.execute(
      `SELECT * FROM Tasks WHERE sprint_backlog_id = ?`,
      [req.params.backlog_id]
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách task' });
  }
};

// POST: Tạo task mới
exports.createTask = async (req, res) => {
  const { task_title, task_description, priority, start_date, due_date } = req.body;
  const { backlog_id } = req.params;
  try {
    await db.execute(
      `INSERT INTO Tasks (sprint_backlog_id, task_title, task_description, task_status, priority, start_date, due_date, created_by)
       VALUES (?, ?, ?, 'Not Started', ?, ?, ?, ?)`,
      [backlog_id, task_title, task_description, priority, start_date, due_date, req.user.user_id]
    );
    res.status(201).json({ message: 'Tạo task thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Không thể tạo task' });
  }
};

// PUT: Cập nhật task
// exports.updateTask = async (req, res) => {
//   const { task_id } = req.params;
//   const { task_title, task_description, task_status, priority, start_date, due_date } = req.body;
//   try {
//     await db.execute(
//       `UPDATE Tasks SET task_title = ?, task_description = ?, task_status = ?, priority = ?, start_date = ?, due_date = ? 
//        WHERE task_id = ?`,
//       [task_title, task_description, task_status, priority, start_date, due_date, task_id]
//     );
//     res.json({ message: 'Cập nhật task thành công' });
//   } catch (err) {
//     res.status(500).json({ error: 'Cập nhật task thất bại' });
//   }
// };


exports.updateTask = async (req, res) => {
  const { task_id } = req.params;
  const {
    task_title,
    task_description,
    task_status,
    priority,
    start_date,
    due_date
  } = req.body;

  try {
    // ✅ Kiểm tra các trường bắt buộc
    if (!task_title || !task_status || !priority) {
      return res.status(400).json({ error: "Thiếu trường bắt buộc (task_title, task_status, priority)" });
    }

    // ✅ Kiểm tra task_id là số
    if (!/^\d+$/.test(task_id)) {
      return res.status(400).json({ error: "task_id không hợp lệ" });
    }

    // ✅ Kiểm tra giá trị priority hợp lệ
    const validPriorities = ['Low', 'Medium', 'High'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ error: "Giá trị priority không hợp lệ" });
    }

    // ✅ Hàm chuẩn hóa ngày về YYYY-MM-DD
    const formatDate = (value) => {
      if (!value) return null;
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date.toISOString().split("T")[0];
    };

    const formattedStart = formatDate(start_date);
    const formattedDue = formatDate(due_date);

    // ✅ Cập nhật dữ liệu
    await db.execute(
      `UPDATE Tasks 
       SET task_title = ?, 
           task_description = ?, 
           task_status = ?, 
           priority = ?, 
           start_date = ?, 
           due_date = ?, 
           updated_at = CURRENT_TIMESTAMP
       WHERE task_id = ?`,
      [
        task_title,
        task_description || null,
        task_status,
        priority,
        formattedStart,
        formattedDue,
        task_id
      ]
    );

    res.json({ message: "Cập nhật task thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật task:", err.message, req.body);
    res.status(500).json({ error: "Cập nhật task thất bại", detail: err.message });
  }
};

// DELETE: Xoá task
exports.deleteTask = async (req, res) => {
  try {
    await db.execute(`DELETE FROM Tasks WHERE task_id = ?`, [req.params.task_id]);
    res.json({ message: 'Đã xoá task' });
  } catch (err) {
    res.status(500).json({ error: 'Không thể xoá task' });
  }
};
