const express = require('express');
const router = express.Router();
const db = require('../models/db');

// CRUD cho Tasks
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM Tasks');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const [row] = await db.query('SELECT * FROM Tasks WHERE task_id = ?', [req.params.id]);
  res.json(row[0]);
});

router.post('/', async (req, res) => {
  const { project_id, task_title, task_description, task_status, priority, start_date, due_date, created_by } = req.body;
  const [result] = await db.query(
    'INSERT INTO Tasks (project_id, task_title, task_description, task_status, priority, start_date, due_date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [project_id, task_title, task_description, task_status, priority, start_date, due_date, created_by]
  );
  res.json({ task_id: result.insertId });
});

router.put('/:id', async (req, res) => {
  const { task_title, task_description, task_status, priority } = req.body;
  await db.query(
    'UPDATE Tasks SET task_title = ?, task_description = ?, task_status = ?, priority = ? WHERE task_id = ?',
    [task_title, task_description, task_status, priority, req.params.id]
  );
  res.json({ message: 'Cập nhật công việc thành công' });
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM Tasks WHERE task_id = ?', [req.params.id]);
  res.json({ message: 'Đã xóa công việc' });
});

module.exports = router;