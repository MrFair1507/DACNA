const express = require('express');
const router = express.Router();
const db = require('../models/db');


// CRUD cho Projects
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM Projects');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const [row] = await db.query('SELECT * FROM Projects WHERE project_id = ?', [req.params.id]);
  res.json(row[0]);
});

router.post('/', async (req, res) => {
  const { project_name, project_description, project_status, created_by } = req.body;
  const [result] = await db.query(
    'INSERT INTO Projects (project_name, project_description, project_status, created_by) VALUES (?, ?, ?, ?)',
    [project_name, project_description, project_status, created_by]
  );
  res.json({ project_id: result.insertId });
});

router.put('/:id', async (req, res) => {
  const { project_name, project_description, project_status } = req.body;
  await db.query(
    'UPDATE Projects SET project_name = ?, project_description = ?, project_status = ? WHERE project_id = ?',
    [project_name, project_description, project_status, req.params.id]
  );
  res.json({ message: 'Cập nhật dự án thành công' });
});

router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM Projects WHERE project_id = ?', [req.params.id]);
  res.json({ message: 'Đã xóa dự án' });
});



module.exports = router;