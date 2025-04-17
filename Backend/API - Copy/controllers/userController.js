const db = require('../models/db');

// Lấy thông tin của người dùng hiện tại
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    console.log(userId);
    const [rows] = await db.query(`
      SELECT user_id, full_name, email, role, avatar_url, phone_number, status, is_verified, created_at, last_login
      FROM Users
      WHERE user_id = ?
    `, [userId]);

    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách tất cả người dùng (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const [users] = await db.query(`
      SELECT user_id, full_name, email, role, phone_number, status, is_verified, last_login, created_at
      FROM Users
      ORDER BY created_at DESC
    `);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật vai trò người dùng (Admin)
exports.updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { newRole } = req.body;

  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const validRoles = ['Admin', 'Manager', 'Member'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    await db.query("UPDATE Users SET role = ? WHERE user_id = ?", [newRole, userId]);
    res.status(200).json({ message: 'User role updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật trạng thái người dùng (Admin)
exports.updateUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const validStatuses = ['Active', 'Inactive', 'Blocked'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await db.query("UPDATE Users SET status = ? WHERE user_id = ?", [status, userId]);
    res.status(200).json({ message: 'User status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật thông tin người dùng của chính mình
exports.updateMyProfile = async (req, res) => {
  const { full_name, avatar_url, phone_number } = req.body;

  try {
    const userId = req.user.user_id;
    await db.query(`
      UPDATE Users
      SET full_name = ?, avatar_url = ?, phone_number = ?
      WHERE user_id = ?
    `, [full_name, avatar_url, phone_number, userId]);

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
