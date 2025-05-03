// Backend/controllers/taskController.js
const db = require('../models/db');

exports.getAllTasks = async (req, res) => {
  try {
    const { sprint_id, project_id } = req.query;
    
    let query = 'SELECT * FROM Tasks';
    const params = [];
    
    // Lọc theo sprint
    if (sprint_id) {
      query += ' WHERE sprint_id = ?';
      params.push(sprint_id);
    } 
    // Hoặc lọc theo project
    else if (project_id) {
      query += ' WHERE project_id = ?';
      params.push(project_id);
    }
    
    query += ' ORDER BY priority DESC, due_date ASC';
    
    const [tasks] = await db.query(query, params);
    
    // Lấy thông tin người được phân công
    const enhancedTasks = await Promise.all(tasks.map(async (task) => {
      const [assignments] = await db.query(
        `SELECT ta.*, u.full_name, u.avatar_url
         FROM Task_Assignment ta
         JOIN Users u ON ta.user_id = u.user_id
         WHERE ta.task_id = ?`,
        [task.task_id]
      );
      
      return {
        ...task,
        assignments: assignments
      };
    }));
    
    res.status(200).json(enhancedTasks);
  } catch (err) {
    console.error('Error getting tasks:', err);
    res.status(500).json({ message: 'Failed to get tasks' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    const [[task]] = await db.query('SELECT * FROM Tasks WHERE task_id = ?', [taskId]);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Lấy thông tin assignments
    const [assignments] = await db.query(
      `SELECT ta.*, u.full_name, u.avatar_url
       FROM Task_Assignment ta
       JOIN Users u ON ta.user_id = u.user_id
       WHERE ta.task_id = ?`,
      [taskId]
    );
    
    // Lấy thông tin comments
    const [comments] = await db.query(
      `SELECT c.*, u.full_name, u.avatar_url
       FROM Comments c
       JOIN Users u ON c.user_id = u.user_id
       WHERE c.task_id = ?
       ORDER BY c.created_at DESC`,
      [taskId]
    );
    
    res.status(200).json({
      ...task,
      assignments,
      comments
    });
  } catch (err) {
    console.error('Error getting task:', err);
    res.status(500).json({ message: 'Failed to get task details' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { 
      sprint_id, 
      project_id,
      task_title, 
      task_description, 
      task_status, 
      priority, 
      start_date, 
      due_date,
      assigned_to
    } = req.body;
    
    const created_by = req.user.user_id;
    
    // Bước 1: Tạo task mới
    const [result] = await db.query(
      `INSERT INTO Tasks (
        sprint_id, project_id, task_title, task_description, 
        task_status, priority, start_date, due_date, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sprint_id, project_id, task_title, task_description, 
        task_status || 'Not Started', priority || 'Medium', 
        start_date, due_date, created_by
      ]
    );
    
    const taskId = result.insertId;
    
    // Bước 2: Nếu có người được phân công, tạo task assignment
    if (assigned_to) {
      await db.query(
        `INSERT INTO Task_Assignment (
          task_id, user_id, assigned_by, completion_percentage, status
        ) VALUES (?, ?, ?, ?, ?)`,
        [taskId, assigned_to, created_by, 0, 'Assigned']
      );
    }
    
    // Bước 3: Tạo thông báo
    // (code tạo thông báo ở đây, nếu cần)
    
    res.status(201).json({ 
      message: 'Task created successfully',
      task_id: taskId
    });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const {
      task_title,
      task_description,
      task_status,
      priority,
      start_date,
      due_date
    } = req.body;
    
    // Kiểm tra task tồn tại
    const [[existingTask]] = await db.query(
      'SELECT * FROM Tasks WHERE task_id = ?',
      [taskId]
    );
    
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Cập nhật task
    await db.query(
      `UPDATE Tasks SET
        task_title = ?,
        task_description = ?,
        task_status = ?,
        priority = ?,
        start_date = ?,
        due_date = ?,
        updated_at = NOW()
      WHERE task_id = ?`,
      [
        task_title || existingTask.task_title,
        task_description || existingTask.task_description,
        task_status || existingTask.task_status,
        priority || existingTask.priority,
        start_date || existingTask.start_date,
        due_date || existingTask.due_date,
        taskId
      ]
    );
    
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Failed to update task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // Kiểm tra task tồn tại
    const [[existingTask]] = await db.query(
      'SELECT * FROM Tasks WHERE task_id = ?',
      [taskId]
    );
    
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Xóa task (cascade xóa comments và assignments trong DB)
    await db.query('DELETE FROM Tasks WHERE task_id = ?', [taskId]);
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};

exports.getTasksByUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    const [tasks] = await db.query(
      `SELECT t.*, ta.status as assignment_status, ta.completion_percentage
       FROM Tasks t
       JOIN Task_Assignment ta ON t.task_id = ta.task_id
       WHERE ta.user_id = ?
       ORDER BY t.due_date ASC`,
      [userId]
    );
    
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error getting user tasks:', err);
    res.status(500).json({ message: 'Failed to get user tasks' });
  }
};