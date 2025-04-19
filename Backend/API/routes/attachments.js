const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Lấy tất cả tệp đính kèm
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM Attachments');
  res.json(rows);
});

// Lấy file theo ID
router.get('/:id', async (req, res) => {
  const [row] = await db.query('SELECT * FROM Attachments WHERE attachment_id = ?', [req.params.id]);
  res.json(row[0]);
});

// Upload file (metadata)
router.post('/', async (req, res) => {
  const { task_id, comment_id, user_id, file_name, file_path, file_type, file_size } = req.body;
  const [result] = await db.query(
    'INSERT INTO Attachments (task_id, comment_id, user_id, file_name, file_path, file_type, file_size) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [task_id || null, comment_id || null, user_id, file_name, file_path, file_type, file_size]
  );
  res.json({ attachment_id: result.insertId });
});

// Xóa file
router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM Attachments WHERE attachment_id = ?', [req.params.id]);
  res.json({ message: 'Tệp đính kèm đã bị xóa' });
});

module.exports = router;