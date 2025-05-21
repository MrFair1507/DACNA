const db = require('../models/db');

exports.getTasksByBacklog = async (req, res) => {
  try {
    const tasks = await db.Tasks.findAll({
      where: { sprint_backlog_id: req.params.backlogId }
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy tasks' });
  }
};

exports.createTask = async (req, res) => {
  const { task_title, task_description, priority } = req.body;
  try {
    const task = await db.Tasks.create({
      sprint_backlog_id: req.params.backlogId,
      task_title,
      task_description,
      task_status: 'Not Started',
      priority: priority || 'Medium',
      created_by: req.user.user_id
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Không thể tạo task' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updated = await db.Tasks.update(req.body, {
      where: { task_id: req.params.id }
    });
    res.json({ message: 'Cập nhật thành công', updated });
  } catch (err) {
    res.status(500).json({ error: 'Cập nhật thất bại' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await db.Tasks.destroy({ where: { task_id: req.params.id } });
    res.json({ message: 'Đã xoá task' });
  } catch (err) {
    res.status(500).json({ error: 'Xoá thất bại' });
  }
};
