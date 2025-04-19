const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Lấy tất cả bình luận
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM Comments');
  res.json(rows);
});

// Lấy bình luận theo ID
router.get('/:id', async (req, res) => {
  const [row] = await db.query('SELECT * FROM Comments WHERE comment_id = ?', [req.params.id]);
  res.json(row[0]);
});

// Thêm bình luận mới
router.post('/', async (req, res) => {
  const { task_id, user_id, content, parent_comment_id } = req.body;
  const [result] = await db.query(
    'INSERT INTO Comments (task_id, user_id, content, parent_comment_id) VALUES (?, ?, ?, ?)',
    [task_id, user_id, content, parent_comment_id || null]
  );
  res.json({ comment_id: result.insertId });
});

// Cập nhật nội dung bình luận
router.put('/:id', async (req, res) => {
  const { content } = req.body;
  await db.query(
    'UPDATE Comments SET content = ? WHERE comment_id = ?',
    [content, req.params.id]
  );
  res.json({ message: 'Bình luận đã được cập nhật' });
});

// Xóa bình luận
router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM Comments WHERE comment_id = ?', [req.params.id]);
  res.json({ message: 'Bình luận đã được xóa' });
});

module.exports = router;
