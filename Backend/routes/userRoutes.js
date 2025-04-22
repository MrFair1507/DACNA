const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate  = require('../middlewares/authMiddleware');
const db = require('../models/db');

// Example: user profile route
router.get('/profile', authenticate, async (req, res) => {
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
router.get('/admin-area', authenticate, (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Admins only' });
  }
  res.json({ message: 'Welcome Admin!' });
});

// ADMIN AREA
// Lấy profile người dùng
router.get('/me', authenticate, userController.getMyProfile);

// Cập nhật thông tin cá nhân
router.put('/me', authenticate, userController.updateMyProfile);

// Lấy danh sách tất cả người dùng (Admin)
router.get('/all', authenticate, userController.getAllUsers);

// Cập nhật vai trò (Admin)
router.put('/:userId/role', authenticate, userController.updateUserRole);

// Cập nhật trạng thái (Admin)
router.put('/:userId/status', authenticate, userController.updateUserStatus);

module.exports = router;
