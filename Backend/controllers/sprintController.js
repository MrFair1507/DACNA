// Backend/controllers/sprintController.js
const db = require('../models/db');
exports.createSprint = async (req, res) => {
  const { project_id, name, description, start_date, end_date } = req.body;
  const user_id = req.user.user_id;

  try {
    const [result] = await db.query(
      `INSERT INTO Sprints (project_id, name, description, start_date, end_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [project_id, name, description, start_date, end_date, user_id]
    );

    const [check] = await db.query(
      `SELECT * FROM User_Project WHERE user_id = ? AND project_id = ?`,
      [user_id, project_id]
    );

    if (check.length === 0) {
      const [roleRow] = await db.query(
        `SELECT role_id FROM ProjectRole WHERE role_name = 'Manager'`
      );
      const managerRoleId = roleRow[0]?.role_id;

      await db.query(
        `INSERT INTO User_Project (user_id, project_id, role_id, status)
         VALUES (?, ?, ?, 'Active')`,
        [user_id, project_id, managerRoleId]
      );
    }

    res.status(201).json({ message: 'Sprint created successfully', sprint_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create sprint' });
  }
};

exports.getAllSprints = async (req, res) => {
  try {
    const { project_id } = req.query;
    
    if (!project_id) {
      return res.status(400).json({ message: 'Project ID is required' });
    }
    
    // Lấy danh sách sprint
    const [sprints] = await db.query(
      `SELECT * FROM Sprints WHERE project_id = ? ORDER BY start_date ASC`,
      [project_id]
    );
    
    // Thêm thông tin số lượng công việc và tiến độ cho mỗi sprint
    const enhancedSprints = await Promise.all(sprints.map(async (sprint) => {
      // Đếm tổng số công việc
      const [[taskCount]] = await db.query(
        `SELECT COUNT(*) as total FROM Tasks WHERE sprint_id = ?`,
        [sprint.sprint_id]
      );
      
      // Đếm số công việc đã hoàn thành
      const [[completedTaskCount]] = await db.query(
        `SELECT COUNT(*) as completed FROM Tasks 
         WHERE sprint_id = ? AND task_status = 'Completed'`,
        [sprint.sprint_id]
      );
      
      // Tính phần trăm hoàn thành
      const totalTasks = taskCount.total || 0;
      const completedTasks = completedTaskCount.completed || 0;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      return {
        ...sprint,
        totalTasks,
        completedTasks,
        progress
      };
    }));
    
    res.status(200).json(enhancedSprints);
  } catch (err) {
    console.error('Error getting sprints:', err);
    res.status(500).json({ message: 'Failed to get sprints' });
  }
};