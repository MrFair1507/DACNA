const db = require('../models/db');

const projectManagerOnly = async (req, res, next) => {
  const user_id = req.user.user_id;
  const project_id = req.params.project_id || req.body.project_id;

  try {
    const [[result]] = await db.query(`
      SELECT pr.role_name
      FROM User_Project up
      JOIN ProjectRole pr ON up.role_id = pr.role_id
      WHERE up.user_id = ? AND up.project_id = ?
    `, [user_id, project_id]);

    if (!result || result.role_name !== 'Project Manager') {
      return res.status(403).json({ message: 'You must be project manager to perform this action.' });
    }

    next();
  } catch (err) {
    console.error('Permission check failed:', err);
    res.status(500).json({ message: 'Failed to verify permission.' });
  }
};

module.exports = { projectManagerOnly };
