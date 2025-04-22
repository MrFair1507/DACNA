const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashBoardController');
const authenticate = require('../middlewares/authMiddleware');

// 🧩 Tạo sprint mới cho dự án (người tạo sẽ được gán Manager nếu chưa có)
router.post('/create-sprint', authenticate, dashboardController.createSprint);

// 👥 Thêm người dùng vào dự án bằng email hoặc tên
router.post('/add-member', authenticate, dashboardController.addUserToProject);

module.exports = router;
