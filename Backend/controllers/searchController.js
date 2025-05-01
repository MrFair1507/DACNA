const db = require('../models/db'); // Assuming you have a db.js file for database connection


exports.searchProjects = async (req, res) => {
    const { keyword } = req.query;
    try {
      const [projects] = await db.query(`
        SELECT * FROM Projects 
        WHERE project_name LIKE ?
      `, [`%${keyword}%`]);
  
      res.status(200).json({ projects });
    } catch (err) {
      console.error('❌ Project search error:', err.message);
      res.status(500).json({ error: 'Failed to search projects' });
    }
  };
  
exports.searchSprints = async (req, res) => {
    const { keyword, project_id } = req.query;
    try {
      const [sprints] = await db.query(`
        SELECT * FROM Sprints 
        WHERE name LIKE ? ${project_id ? 'AND project_id = ?' : ''}
      `, project_id ? [`%${keyword}%`, project_id] : [`%${keyword}%`]);
  
      res.status(200).json({ sprints });
    } catch (err) {
      console.error('❌ Sprint search error:', err.message);
      res.status(500).json({ error: 'Failed to search sprints' });
    }
  };

  exports.searchTasks = async (req, res) => {
    const { keyword, sprint_id, status } = req.query;
    try {
      let query = `SELECT * FROM Tasks WHERE (task_title LIKE ? OR task_description LIKE ?)`;
      let params = [`%${keyword}%`, `%${keyword}%`];
  
      if (sprint_id) {
        query += ' AND sprint_id = ?';
        params.push(sprint_id);
      }
      if (status) {
        query += ' AND task_status = ?';
        params.push(status);
      }
  
      const [tasks] = await db.query(query, params);
  
      res.status(200).json({ tasks });
    } catch (err) {
      console.error('❌ Task search error:', err.message);
      res.status(500).json({ error: 'Failed to search tasks' });
    }
  };
  