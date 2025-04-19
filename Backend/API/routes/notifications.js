const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Lấy tất cả thông báo
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM Notifications');
  res.json(rows);
});

// Lấy thông báo theo người dùng
router.get('/user/:userId', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM Notifications WHERE user_id = ?', [req.params.userId]);
  res.json(rows);
});

// Thêm thông báo
router.post('/', async (req, res) => {
  const { user_id, project_id, message, related_project, related_task } = req.body;
  const [result] = await db.query(
    'INSERT INTO Notifications (user_id, project_id, message, related_project, related_task) VALUES (?, ?, ?, ?, ?)',
    [user_id, project_id, message, related_project, related_task]
  );
  res.json({ notification_id: result.insertId });
});

// Đánh dấu đã đọc
router.put('/:id/read', async (req, res) => {
  await db.query('UPDATE Notifications SET is_read = TRUE WHERE notification_id = ?', [req.params.id]);
  res.json({ message: 'Thông báo đã được đánh dấu là đã đọc' });
});

module.exports = router;

