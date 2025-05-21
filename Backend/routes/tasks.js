const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middlewares/authMiddleware');



// Lấy tất cả task breakdown của 1 backlog
router.get('/backlog/:backlogId/tasks', auth, taskController.getTasksByBacklog);

// Thêm task vào sprint_backlog
router.post('/backlog/:backlogId/tasks', auth, taskController.createTask);

// Cập nhật task
router.put('/tasks/:id', auth, taskController.updateTask);

// Xoá task
router.delete('/tasks/:id', auth, taskController.deleteTask);

module.exports = router;
