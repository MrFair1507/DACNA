const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashBoardController');
const { updateProject } = require('../controllers/dashBoardController');
const authenticate = require('../middlewares/authMiddleware');
const requestLogger = require('../middlewares/requestLogger');
const { projectManagerOnly } = require('../middlewares/projectPermission');



router.use(authenticate);
// 🧩 Tạo sprint mới cho dự án (người tạo sẽ được gán Manager nếu chưa có)
router.post('/create-sprint', authenticate, requestLogger, dashboardController.createSprint);

// 👥 Thêm người dùng vào dự án bằng email hoặc tên
router.post('/add-member', authenticate, requestLogger, projectManagerOnly, dashboardController.addUserToProject);

router.put('/projects/:project_id', authenticate, requestLogger, projectManagerOnly, updateProject);
router.use(requestLogger);  
module.exports = router;
