const db = require('../models/db');

exports.getBacklogBySprint = async (req, res) => {
  try {
    const backlog = await db.Sprint_Backlog.findAll({
      where: { sprint_id: req.params.sprintId },
      include: [{ model: db.User, as: 'creator', attributes: ['full_name'] }]
    });
    res.json(backlog);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy backlog' });
  }
};

exports.createSprintBacklog = async (req, res) => {
  const { title, description } = req.body;
  try {
    const entry = await db.Sprint_Backlog.create({
      sprint_id: req.params.sprintId,
      title,
      description,
      created_by: req.user.user_id
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Không thể tạo sprint backlog' });
  }
};

exports.updateSprintBacklog = async (req, res) => {
  try {
    const updated = await db.Sprint_Backlog.update(req.body, {
      where: { sprint_backlog_id: req.params.id }
    });
    res.json({ message: 'Cập nhật thành công', updated });
  } catch (err) {
    res.status(500).json({ error: 'Cập nhật thất bại' });
  }
};

exports.deleteSprintBacklog = async (req, res) => {
  try {
    await db.Sprint_Backlog.destroy({ where: { sprint_backlog_id: req.params.id } });
    res.json({ message: 'Đã xoá sprint backlog' });
  } catch (err) {
    res.status(500).json({ error: 'Xoá thất bại' });
  }
};
