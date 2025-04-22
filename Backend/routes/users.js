// File: routes/users.js

const express = require('express');
const router = express.Router();
const db = require('../models/db');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');
const requestLogger = require('../middleware/requestLogger');

// [GET] Lấy tất cả users
router.get('/', async (req, res) => {
  const [users] = await db.query('SELECT * FROM Users');
  res.json(users);
});

// [GET] Lấy user theo id
router.get('/:id', async (req, res) => {
  const [user] = await db.query('SELECT * FROM Users WHERE user_id = ?', [req.params.id]);
  res.json(user[0]);
});

// [POST] Thêm user mới
router.post('/', async (req, res) => {
  const { full_name, email, password_hash, role } = req.body;
  const [result] = await db.query(
    'INSERT INTO Users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [full_name, email, password_hash, role]
  );
  res.json({ user_id: result.insertId });
});

// [PUT] Cập nhật user
router.put('/:id', async (req, res) => {
  const { full_name, phone_number, status } = req.body;
  await db.query(
    'UPDATE Users SET full_name = ?, phone_number = ?, status = ? WHERE user_id = ?',
    [full_name, phone_number, status, req.params.id]
  );
  res.json({ message: 'Cập nhật thành công' });
});

// [PUT] Cập nhật role user
router.put('/role/:id', async (req, res) => {
  const { role } = req.body;
  await db.query(
    'UPDATE Users SET role = ? WHERE user_id = ?',
    [role, req.params.id]
  );
  res.json({ message: 'Cập nhật vai tro thành công' });
});

// [DELETE] Xóa user
router.delete('/:id', async (req, res) => {
  await db.query('DELETE FROM Users WHERE user_id = ?', [req.params.id]);
  res.json({ message: 'Đã xóa user' });
});

router.use(authenticate);      // Xác thực trước
router.use(requestLogger);     // Ghi log sau khi biết người dùng

router.get('/me', authenticate, userController.getMyProfile);
router.get('/all', authenticate, userController.getAllUsers);

module.exports = router;
