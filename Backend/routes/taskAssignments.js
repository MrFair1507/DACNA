// const express = require('express');
// const router = express.Router();
// const db = require('../models/db');

// // CRUD cho Task_Assignment
// router.get('/', async (req, res) => {
//   const [rows] = await db.query('SELECT * FROM Task_Assignment');
//   res.json(rows);
// });

// router.get('/:id', async (req, res) => {
//   const [row] = await db.query('SELECT * FROM Task_Assignment WHERE assignment_id = ?', [req.params.id]);
//   res.json(row[0]);
// });

// router.post('/', async (req, res) => {
//   const { task_id, user_id, assigned_by, completion_percentage, status } = req.body;
//   const [result] = await db.query(
//     'INSERT INTO Task_Assignment (task_id, user_id, assigned_by, completion_percentage, status) VALUES (?, ?, ?, ?, ?)',
//     [task_id, user_id, assigned_by, completion_percentage, status]
//   );
//   res.json({ assignment_id: result.insertId });
// });

// router.put('/:id', async (req, res) => {
//   const { completion_percentage, status } = req.body;
//   await db.query(
//     'UPDATE Task_Assignment SET completion_percentage = ?, status = ? WHERE assignment_id = ?',
//     [completion_percentage, status, req.params.id]
//   );
//   res.json({ message: 'Cập nhật phân công thành công' });
// });

// router.delete('/:id', async (req, res) => {
//   await db.query('DELETE FROM Task_Assignment WHERE assignment_id = ?', [req.params.id]);
//   res.json({ message: 'Đã xóa phân công' });
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET: Danh sách toàn bộ phân công
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM Task_Assignment');
  res.json(rows);
});

// GET: Một phân công cụ thể
router.get('/:id', async (req, res) => {
  const [row] = await db.query(
    'SELECT * FROM Task_Assignment WHERE assignment_id = ?',
    [req.params.id]
  );
  res.json(row[0]);
});

// POST: Giao task cho người dùng và gửi thông báo cho toàn bộ thành viên dự án
router.post('/', async (req, res) => {
  const { task_id, user_id, assigned_by, completion_percentage, status } = req.body;

  try {
    // Tạo phân công
    const [result] = await db.query(
      `INSERT INTO Task_Assignment (task_id, user_id, assigned_by, completion_percentage, status)
       VALUES (?, ?, ?, ?, ?)`,
      [task_id, user_id, assigned_by, completion_percentage, status]
    );

    // Lấy thông tin task và project
    const [[task]] = await db.query(
      'SELECT task_title, sprint_backlog_id FROM Tasks WHERE task_id = ?',
      [task_id]
    );

    const [[projectRow]] = await db.query(
      'SELECT project_id FROM Sprint_Backlog WHERE sprint_backlog_id = ?',
      [task.sprint_backlog_id]
    );

    const project_id = projectRow.project_id;

    // Lấy tất cả thành viên của dự án
    const [members] = await db.query(
      `SELECT user_id FROM User_Project WHERE project_id = ? AND status = 'accepted'`,
      [project_id]
    );

    // Gửi thông báo đến tất cả thành viên
    const insertPromises = members.map((member) =>
      db.query(
        `INSERT INTO Notifications (user_id, project_id, message, related_project, related_task)
         VALUES (?, ?, ?, ?, ?)`,
        [
          member.user_id,
          project_id,
          `📌 Công việc mới được giao: ${task.task_title}`,
          project_id,
          task_id
        ]
      )
    );
    await Promise.all(insertPromises);

    res.json({ assignment_id: result.insertId });
  } catch (err) {
    console.error("❌ Lỗi khi giao task:", err.message);
    res.status(500).json({ error: 'Không thể phân công task' });
  }
});

// PUT: Cập nhật trạng thái phân công và gửi thông báo nếu hoàn thành
router.put('/:id', async (req, res) => {
  const { completion_percentage, status } = req.body;

  try {
    // Lấy thông tin cũ để biết task và user
    const [[assignment]] = await db.query(
      'SELECT * FROM Task_Assignment WHERE assignment_id = ?',
      [req.params.id]
    );

    if (!assignment)
      return res.status(404).json({ message: 'Phân công không tồn tại' });

    // Cập nhật trạng thái
    await db.query(
      `UPDATE Task_Assignment SET completion_percentage = ?, status = ? WHERE assignment_id = ?`,
      [completion_percentage, status, req.params.id]
    );

    // Nếu task hoàn thành → thông báo cho tất cả thành viên dự án
    if (status === 'Completed') {
      const [[task]] = await db.query(
        'SELECT task_title, sprint_backlog_id FROM Tasks WHERE task_id = ?',
        [assignment.task_id]
      );
      const [[projectRow]] = await db.query(
        'SELECT project_id FROM Sprint_Backlog WHERE sprint_backlog_id = ?',
        [task.sprint_backlog_id]
      );

      const project_id = projectRow.project_id;

      const [members] = await db.query(
        `SELECT user_id FROM User_Project WHERE project_id = ? AND status = 'accepted'`,
        [project_id]
      );

      const insertPromises = members.map((member) =>
        db.query(
          `INSERT INTO Notifications (user_id, project_id, message, related_project, related_task)
           VALUES (?, ?, ?, ?, ?)`,
          [
            member.user_id,
            project_id,
            `✅ Công việc "${task.task_title}" đã được hoàn thành.`,
            project_id,
            assignment.task_id
          ]
        )
      );
      await Promise.all(insertPromises);
    }

    res.json({ message: 'Cập nhật phân công thành công' });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật task assignment:", err.message);
    res.status(500).json({ error: 'Không thể cập nhật phân công' });
  }
});

// DELETE: Xóa phân công
router.delete('/:id', async (req, res) => {
  try {
    await db.query(
      'DELETE FROM Task_Assignment WHERE assignment_id = ?',
      [req.params.id]
    );
    res.json({ message: 'Đã xóa phân công' });
  } catch (err) {
    res.status(500).json({ error: 'Không thể xóa phân công' });
  }
});

module.exports = router;
