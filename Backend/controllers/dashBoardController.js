const db = require('../models/db');



exports.addUserToProject = async (req, res) => {
  const { project_id, email_or_name, role_name } = req.body;

  try {
    // Tìm user theo email hoặc tên
    const [[user]] = await db.query(
      `SELECT user_id FROM Users WHERE email = ? OR full_name = ?`,
      [email_or_name, email_or_name]
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Kiểm tra đã có trong dự án chưa
    const [[exists]] = await db.query(
      `SELECT * FROM User_Project WHERE user_id = ? AND project_id = ?`,
      [user.user_id, project_id]
    );

    if (exists) return res.status(400).json({ message: 'User already in project' });

    // Tìm role_id từ role_name
    const [[role]] = await db.query(
      `SELECT role_id FROM ProjectRole WHERE role_name = ?`,
      [role_name]
    );

    if (!role) return res.status(404).json({ message: 'Role not found' });

    // Thêm user vào User_Project
    await db.query(
      `INSERT INTO User_Project (user_id, project_id, role_id, status)
       VALUES (?, ?, ?, 'Active')`,
      [user.user_id, project_id, role.role_id]
    );

    res.status(200).json({ message: `User added to project as ${role_name}` });

  } catch (err) {
    console.error('❌ Error adding user:', err.message);
    res.status(500).json({ error: 'Failed to add user to project' });
  }
};

exports.updateProject = async (req, res) => {
  const { project_id } = req.params;
  const { project_name, project_description, project_status } = req.body;

  try {
    // Kiểm tra tồn tại
    const [[project]] = await db.query(`SELECT * FROM Projects WHERE project_id = ?`, [project_id]);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Cập nhật
    await db.query(`
      UPDATE Projects
      SET project_name = ?, project_description = ?, project_status = ?, updated_at = NOW()
      WHERE project_id = ?
    `, [project_name, project_description, project_status, project_id]);

    res.status(200).json({ message: 'Project updated successfully' });
  } catch (err) {
    console.error('❌ Error updating project:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
};