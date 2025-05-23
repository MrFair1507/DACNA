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
exports.updateTask = async (req, res) => {
  const { task_id } = req.params;
  const { task_title, task_description, task_status, priority, start_date, due_date } = req.body;
  try {
    await db.execute(
      `UPDATE Tasks SET task_title = ?, task_description = ?, task_status = ?, priority = ?, start_date = ?, due_date = ? 
       WHERE task_id = ?`,
      [task_title, task_description, task_status, priority, start_date, due_date, task_id]
    );
    res.json({ message: 'Cập nhật task thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Cập nhật task thất bại' });
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
