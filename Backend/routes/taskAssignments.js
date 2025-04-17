const express = require('express');
const router = express.Router();
const db = require('../models/db');

// CRUD cho Task_Assignment
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM Task_Assignment');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const [row] = await db.query('SELECT * FROM Task_Assignment WHERE assignment_id = ?', [req.params.id]);
  res.json(row[0]);
});

router.post('/', async (req, res) => {
  const { task_id, user_id, assigned_by, completion_percentage, status } = req.body;
  const [result] = await db.query(
    'INSERT INTO Task_Assignment (task_id, user_id, assigned_by, completion_percentage, status) VALUES (?, ?, ?, ?, ?)',
    [task_id, user_id, assigned_by, completion_percentage, status]
  );
  res.json({ assignment_id: result.insertId });
});

router.put('/:id', async (req, res) => {
  const { completion_percentage, status } = req.body;
  await db.query(
    'UPDATE Task_Assignment SET completion_percentage = ?, status = ? WHERE assignment_id = ?',
    [completion_percentage, status, req.params.id]
  );
  res.json({ message: 'Cập nhật phân công thành công' });
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM Task_Assignment WHERE assignment_id = ?', [req.params.id]);
  res.json({ message: 'Đã xóa phân công' });
});

module.exports = router;