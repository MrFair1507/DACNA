const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate  = require('../middlewares/authMiddleware');
const requestLogger = require('../middlewares/requestLogger');
const db = require('../models/db');

// Example: user profile route
router.get('/profile', authenticate, requestLogger, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT user_id, full_name, email, role FROM Users WHERE user_id = ?",
      [req.user.user_id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example: only admins
router.get('/admin-area', authenticate, requestLogger,(req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Admins only' });
  }
  res.json({ message: 'Welcome Admin!' });
});

// ADMIN AREA
// Lấy profile người dùng
router.get('/me', authenticate, requestLogger, userController.getMyProfile);

// Cập nhật thông tin cá nhân
router.put('/me', authenticate, requestLogger, userController.updateMyProfile);

// Lấy danh sách tất cả người dùng (Admin)
router.get('/all', authenticate, requestLogger, userController.getAllUsers);

// Cập nhật vai trò (Admin)
router.put('/:userId/role', authenticate, requestLogger, userController.updateUserRole);

// Cập nhật trạng thái (Admin)
router.put('/:userId/status', authenticate, requestLogger, userController.updateUserStatus);

module.exports = router;
