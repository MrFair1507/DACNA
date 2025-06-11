// controllers/invitationController.js
const db = require('../models/db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Gửi lời mời qua email
exports.sendInvitationByEmail = async (req, res) => {
  const { projectId, emails, role, message } = req.body;
  const inviterId = req.user.user_id;

  try {
    const [[project]] = await db.query('SELECT * FROM Projects WHERE project_id = ?', [projectId]);
    if (!project) return res.status(404).json({ message: 'Dự án không tồn tại' });

    const [[access]] = await db.query(
      'SELECT * FROM User_Project WHERE user_id = ? AND project_id = ? AND status = "accepted"',
      [inviterId, projectId]
    );
    if (!access) return res.status(403).json({ message: 'Không có quyền gửi lời mời' });

    const results = [];

    for (const email of emails) {
      const [[member]] = await db.query(
        `SELECT up.* FROM User_Project up
         JOIN Users u ON u.user_id = up.user_id
         WHERE u.email = ? AND up.project_id = ?`,
        [email, projectId]
      );
      if (member) {
        results.push({ email, status: 'already_member' });
        continue;
      }

      const [[inv]] = await db.query(
        'SELECT * FROM ProjectInvitations WHERE email = ? AND project_id = ? AND status = "pending"',
        [email, projectId]
      );
      if (inv) {
        results.push({ email, status: 'already_invited' });
        continue;
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const [result] = await db.query(
        `INSERT INTO ProjectInvitations (project_id, email, invited_by, role_id, token, expires_at, status)
         VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
        [projectId, email, inviterId, role, token, expires]
      );

      const inviteUrl = `${process.env.FRONTEND_URL}/invitation/accept?token=${token}`;

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: `"Task Management" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Lời mời tham gia dự án: ${project.project_name}`,
        html: `
          <p>Bạn được mời vào dự án <strong>${project.project_name}</strong>.</p>
          <p><a href="${inviteUrl}">Bấm vào đây để tham gia</a>. Liên kết hết hạn sau 7 ngày.</p>
        `
      });

      results.push({ email, status: 'invited' });
    }

    res.json({ message: 'Đã gửi lời mời', invitations: results });

  } catch (err) {
    console.error("❌ Gửi lời mời lỗi:", err);
    res.status(500).json({ error: 'Lỗi gửi lời mời' });
  }
};

// Chấp nhận lời mời
exports.acceptInvitation = async (req, res) => {
  const { token } = req.body;

  try {
    const [[invitation]] = await db.query(
      'SELECT * FROM ProjectInvitations WHERE token = ? AND status = "pending"',
      [token]
    );
    if (!invitation) return res.status(404).json({ message: 'Lời mời không hợp lệ hoặc đã dùng' });

    if (new Date(invitation.expires_at) < new Date()) {
      await db.query(
        'UPDATE ProjectInvitations SET status = "expired" WHERE invitation_id = ?',
        [invitation.invitation_id]
      );
      return res.status(400).json({ message: 'Lời mời đã hết hạn' });
    }

    const [[user]] = await db.query('SELECT * FROM Users WHERE email = ?', [invitation.email]);
    if (!user) {
      return res.status(404).json({
        message: 'Chưa có tài khoản. Cần đăng ký trước.',
        requireRegistration: true
      });
    }

    const [[exists]] = await db.query(
      'SELECT * FROM User_Project WHERE user_id = ? AND project_id = ?',
      [user.user_id, invitation.project_id]
    );
    if (!exists) {
      await db.query(
        'INSERT INTO User_Project (user_id, project_id, role_id, status) VALUES (?, ?, ?, "accepted")',
        [user.user_id, invitation.project_id, invitation.role_id]
      );
    }

    await db.query(
      'UPDATE ProjectInvitations SET status = "accepted" WHERE invitation_id = ?',
      [invitation.invitation_id]
    );

    res.json({ message: 'Tham gia dự án thành công' });

  } catch (err) {
    console.error("❌ Accept lỗi:", err);
    res.status(500).json({ error: 'Lỗi khi xác nhận lời mời' });
  }
};

// Lấy danh sách lời mời
exports.getProjectInvitations = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.user_id;

  try {
    const [[access]] = await db.query(
      'SELECT * FROM User_Project WHERE user_id = ? AND project_id = ? AND status = "accepted"',
      [userId, projectId]
    );
    if (!access) return res.status(403).json({ message: 'Không có quyền xem lời mời' });

    const [list] = await db.query(
      `SELECT pi.*, u.full_name as inviter_name
       FROM ProjectInvitations pi
       JOIN Users u ON u.user_id = pi.invited_by
       WHERE pi.project_id = ?
       ORDER BY pi.created_at DESC`,
      [projectId]
    );
    res.json(list);

  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy lời mời' });
  }
};

// Hủy lời mời
exports.cancelInvitation = async (req, res) => {
  const { invitationId } = req.params;
  const userId = req.user.user_id;

  try {
    const [[inv]] = await db.query('SELECT * FROM ProjectInvitations WHERE invitation_id = ?', [invitationId]);
    if (!inv) return res.status(404).json({ message: 'Lời mời không tồn tại' });

    const [[access]] = await db.query(
      'SELECT * FROM User_Project WHERE user_id = ? AND project_id = ? AND status = "accepted"',
      [userId, inv.project_id]
    );
    if (!access && inv.invited_by !== userId)
      return res.status(403).json({ message: 'Không có quyền hủy' });

    await db.query('UPDATE ProjectInvitations SET status = "cancelled" WHERE invitation_id = ?', [invitationId]);
    res.json({ message: 'Đã hủy lời mời' });

  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi hủy lời mời' });
  }
};
