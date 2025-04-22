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

exports.addUserToProject = async (req, res) => {
  const { project_id, identifier } = req.body;

  try {
    const [userRow] = await db.query(
      `SELECT user_id FROM Users WHERE email = ? OR full_name = ?`,
      [identifier, identifier]
    );

    if (userRow.length === 0) return res.status(404).json({ message: 'User not found' });

    const user_id = userRow[0].user_id;

    const [check] = await db.query(
      `SELECT * FROM User_Project WHERE user_id = ? AND project_id = ?`,
      [user_id, project_id]
    );

    if (check.length > 0) return res.status(400).json({ message: 'User already in project' });

    const [roleRow] = await db.query(
      `SELECT role_id FROM ProjectRole WHERE role_name = 'Member'`
    );
    const memberRoleId = roleRow[0]?.role_id;

    await db.query(
      `INSERT INTO User_Project (user_id, project_id, role_id, status)
       VALUES (?, ?, ?, 'Active')`,
      [user_id, project_id, memberRoleId]
    );

    res.json({ message: 'User added to project successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add user to project' });
  }
};
