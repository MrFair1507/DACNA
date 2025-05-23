const express = require('express');
const router = express.Router();
const controller = require('../controllers/sprintBacklogController');
const auth = require('../middlewares/authMiddleware');

// Lấy backlog của project (hiển thị tab Product Backlog)
router.get('/projects/:projectId/backlog', auth, controller.getProductBacklog);

// Tạo backlog mới cho project
router.post('/projects/:projectId/backlog', auth, controller.createBacklog);

// Gán backlog vào sprint
router.put('/backlog/:backlogId/assign', auth, controller.assignToSprint);

// Cập nhật trạng thái (Done, Deferred)
router.put('/backlog/:backlogId/status', auth, controller.updateStatus);

// Lấy backlog theo sprint
router.get('/sprints/:sprintId/backlog', auth, controller.getBacklogBySprint);

module.exports = router;
