const db = require('../models/db'); // mysql2 connection

// GET: backlog chưa gán sprint (Product Backlog)
exports.getProductBacklog = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM Sprint_Backlog WHERE project_id = ? AND sprint_id IS NULL`,
      [req.params.projectId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy backlog' });
  }
};

// POST: tạo backlog mới
exports.createBacklog = async (req, res) => {
  const { title } = req.body;
  try {
    await db.execute(
      `INSERT INTO Sprint_Backlog (project_id, title, status, created_by)
       VALUES (?, ?, 'Pending', ?)`,
      [req.params.projectId, title, req.user.user_id]
    );
    res.status(201).json({ message: 'Sprint Backlog đã được tạo' });
  } catch (err) {
    res.status(500).json({ error: 'Tạo backlog thất bại' });
  }
};

// PUT: gán backlog vào sprint
exports.assignToSprint = async (req, res) => {
  const { backlogId } = req.params;
  const { sprint_id } = req.body;
  try {
    await db.execute(
      `UPDATE Sprint_Backlog SET sprint_id = ?, status = 'Assigned' WHERE sprint_backlog_id = ?`,
      [sprint_id, backlogId]
    );
    res.json({ message: 'Đã gán backlog vào sprint' });
  } catch (err) {
    res.status(500).json({ error: 'Gán sprint thất bại' });
  }
};

// PUT: cập nhật trạng thái backlog (Done, Deferred)
exports.updateStatus = async (req, res) => {
  const { backlogId } = req.params;
  const { status } = req.body;
  try {
    await db.execute(
      `UPDATE Sprint_Backlog SET status = ? WHERE sprint_backlog_id = ?`,
      [status, backlogId]
    );
    res.json({ message: 'Cập nhật trạng thái thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Cập nhật trạng thái thất bại' });
  }
};

// GET: backlog theo sprint
exports.getBacklogBySprint = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT * FROM Sprint_Backlog WHERE sprint_id = ?`,
      [req.params.sprintId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy backlog của sprint' });
  }
};
