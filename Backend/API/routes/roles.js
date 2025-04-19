const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Lấy tất cả vai trò
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM ProjectRole');
  res.json(rows);
});

// Thêm vai trò mới
router.post('/', async (req, res) => {
  const { role_name, role_description } = req.body;
  const [result] = await db.query(
    'INSERT INTO ProjectRole (role_name, role_description) VALUES (?, ?)',
    [role_name, role_description]
  );
  res.json({ role_id: result.insertId });
});

// Cập nhật vai trò
router.put('/:id', async (req, res) => {
  const { role_name, role_description } = req.body;
  await db.query(
    'UPDATE ProjectRole SET role_name = ?, role_description = ? WHERE role_id = ?',
    [role_name, role_description, req.params.id]
  );
  res.json({ message: 'Cập nhật vai trò thành công' });
});

// Xóa vai trò
router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM ProjectRole WHERE role_id = ?', [req.params.id]);
  res.json({ message: 'Đã xóa vai trò' });
});

module.exports = router;
