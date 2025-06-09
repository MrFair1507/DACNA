const express = require('express');
const router = express.Router();
const controller = require('../controllers/sprintBacklogController');
const authenticate = require('../middlewares/authMiddleware');
const requestLogger = require('../middlewares/requestLogger');

// Lấy backlog của project (hiển thị tab Product Backlog)
router.get('/projects/:projectId/backlog', authenticate, requestLogger, controller.getProductBacklog);

// Tạo backlog mới cho project
router.post('/projects/:projectId/backlog', authenticate, requestLogger, controller.createBacklog);

// Gán backlog vào sprint
router.put('/backlog/:backlogId/assign', authenticate, requestLogger, controller.assignToSprint);

// Cập nhật trạng thái (Done, Deferred)
router.put('/backlog/:backlogId/status', authenticate, requestLogger, controller.updateStatus);

// Lấy backlog theo sprint
router.get('/sprints/:sprintId/backlog', authenticate, requestLogger, controller.getBacklogBySprint);

module.exports = router;
