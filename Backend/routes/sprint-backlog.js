const express = require('express');
const router = express.Router();
const sprintBacklogController = require('../controllers/sprintBacklogController');
const auth = require('../middlewares/authMiddleware');
const requestLogger = require('../middlewares/requestLogger');


router.use(requestLogger); 
// Lấy tất cả backlog theo sprint
router.get('/sprints/:sprintId/backlog', auth, sprintBacklogController.getBacklogBySprint);

// Tạo mới một backlog trong sprint
router.post('/sprints/:sprintId/backlog', auth, sprintBacklogController.createSprintBacklog);

// Cập nhật backlog
router.put('/backlog/:id', auth, sprintBacklogController.updateSprintBacklog);

// Xoá backlog
router.delete('/backlog/:id', auth, sprintBacklogController.deleteSprintBacklog);

module.exports = router;
