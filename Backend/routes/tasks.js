const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskController');
const auth = require('../middlewares/authMiddleware');
const requestLogger = require('../middlewares/requestLogger');

router.use(requestLogger); // Log all requests to this router
router.get('/backlog/:backlog_id/tasks', auth, controller.getTasksByBacklog);
router.post('/backlog/:backlog_id/tasks', auth, controller.createTask);
// router.put('/tasks/:task_id', auth, controller.updateTask);
router.put('/:task_id', auth, controller.updateTask);
router.delete('/:task_id', auth, controller.deleteTask);

module.exports = router;
