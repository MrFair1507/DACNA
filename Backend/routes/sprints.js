// routes/Sprints.js

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const searchController = require('../controllers/searchController');
const db = require('../models/db');

// ✅ Create Sprint
router.post('/', authenticate, async (req, res) => {
  const { project_id, name, description, start_date, end_date } = req.body;
  const created_by = req.user.user_id;

  try {
    const [result] = await db.query(
      `INSERT INTO Sprints (project_id, name, description, start_date, end_date, created_by) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [project_id, name, description, start_date, end_date, created_by]
    );
    res.status(201).json({ message: 'Sprint created successfully', sprint_id: result.insertId });
  } catch (err) {
    console.error('❌ Error creating sprint:', err.message);
    res.status(500).json({ error: 'Failed to create sprint' });
  }
});

// ✅ Update Sprint
router.put('/:sprint_id', authenticate, async (req, res) => {
  const { sprint_id } = req.params;
  const { name, description, start_date, end_date } = req.body;

  try {
    await db.query(
      `UPDATE Sprints SET name=?, description=?, start_date=?, end_date=? WHERE sprint_id=?`,
      [name, description, start_date, end_date, sprint_id]
    );
    res.json({ message: 'Sprint updated successfully' });
  } catch (err) {
    console.error('❌ Error updating sprint:', err.message);
    res.status(500).json({ error: 'Failed to update sprint' });
  }
});

// ✅ Delete Sprint
router.delete('/:sprint_id', authenticate, async (req, res) => {
  const { sprint_id } = req.params;

  try {
    await db.query(`DELETE FROM Sprints WHERE sprint_id=?`, [sprint_id]);
    res.json({ message: 'Sprint deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting sprint:', err.message);
    res.status(500).json({ error: 'Failed to delete sprint' });
  }
});

// ✅ Search Sprints
router.get('/search', authenticate, async (req, res) => {
  const { keyword, project_id } = req.query;

  try {
    let query = `SELECT * FROM Sprints WHERE name LIKE ?`;
    let params = [`%${keyword}%`];

    if (project_id) {
      query += ' AND project_id = ?';
      params.push(project_id);
    }

    const [rows] = await db.query(query, params);
    res.json({ sprints: rows });
  } catch (err) {
    console.error('❌ Error searching sprints:', err.message);
    res.status(500).json({ error: 'Failed to search sprints' });
  }
});

// ✅ Get Sprints by Project ID
router.get('/project/:project_id', authenticate, async (req, res) => {
  const { project_id } = req.params;

  try {
    const [rows] = await db.query(`SELECT * FROM Sprints WHERE project_id = ?`, [project_id]);
    res.json({ sprints: rows });
  } catch (err) {
    console.error('❌ Error fetching sprints:', err.message);
    res.status(500).json({ error: 'Failed to fetch sprints' });
  }
});

router.get('/search', authenticate, searchController.searchSprints);

module.exports = router;
