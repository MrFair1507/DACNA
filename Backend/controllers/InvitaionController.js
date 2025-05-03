// Backend/controllers/invitationController.js
const db = require('../models/db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Tạo và gửi lời mời qua email
exports.sendInvitationByEmail = async (req, res) => {
  const { projectId, emails, role, message } = req.body;
  const inviterId = req.user.user_id;

  try {
    // Kiểm tra dự án tồn tại không
    const [[project]] = await db.query(
      'SELECT * FROM Projects WHERE project_id = ?',
      [projectId]
    );

    if (!project) {
      return res.status(404).json({ message: 'Dự án không tồn tại' });
    }

    // Kiểm tra người gửi lời mời có quyền với dự án không
    const [[userAccess]] = await db.query(
      `SELECT * FROM User_Project 
       WHERE user_id = ? AND project_id = ? AND status = 'Active'`,
      [inviterId, projectId]
    );

    if (!userAccess) {
      return res.status(403).json({ message: 'Bạn không có quyền với dự án này' });
    }
    
    // Đối với mỗi email, tạo lời mời và gửi email
    const invitations = [];
    
    for (const email of emails) {
      // Kiểm tra email có là thành viên của dự án chưa
      const [[existingMember]] = await db.query(
        `SELECT up.* FROM User_Project up
         JOIN Users u ON up.user_id = u.user_id
         WHERE u.email = ? AND up.project_id = ? AND up.status = 'Active'`,
        [email, projectId]
      );
      
      if (existingMember) {
        invitations.push({ email, status: 'already_member' });
        continue;
      }
      
      // Kiểm tra email đã có lời mời chưa
      const [[existingInvitation]] = await db.query(
        `SELECT * FROM ProjectInvitations 
         WHERE email = ? AND project_id = ? AND status = 'pending'`,
        [email, projectId]
      );
      
      if (existingInvitation) {
        invitations.push({ email, status: 'already_invited' });
        continue;
      }
      
      // Tạo token duy nhất cho lời mời này
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Hết hạn sau 7 ngày
      
      // Lưu lời mời vào database
      const [result] = await db.query(
        `INSERT INTO ProjectInvitations 
         (project_id, email, invited_by, role_id, token, expires_at, status)
         VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
        [projectId, email, inviterId, role, token, expiresAt]
      );
      
      // Tạo URL cho link trong email
      const inviteUrl = `${process.env.FRONTEND_URL}/invitation/accept?token=${token}`;
      
      // Gửi email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Lời mời tham gia dự án: ${project.project_name}`,
        html: `
          <h3>Lời mời tham gia dự án</h3>
          <p>Bạn đã được mời tham gia dự án: <strong>${project.project_name}</strong></p>
          ${message ? `<p>Tin nhắn: ${message}</p>` : ''}
          <p>Nhấp vào liên kết dưới đây để tham gia:</p>
          <a href="${inviteUrl}" style="padding:10px 15px; background-color:#8e44ad; color:white; text-decoration:none; border-radius:5px; display:inline-block;">Tham gia dự án</a>
          <p>Lưu ý: Liên kết này sẽ hết hạn sau 7 ngày.</p>
        `
      };
      
      await transporter.sendMail(mailOptions);
      invitations.push({ email, status: 'invited', invitation_id: result.insertId });
    }
    
    res.status(200).json({ 
      message: 'Đã gửi lời mời thành công', 
      invitations 
    });
    
  } catch (err) {
    console.error('Error sending invitation:', err);
    res.status(500).json({ message: 'Lỗi khi gửi lời mời', error: err.message });
  }
};

// Chấp nhận lời mời
exports.acceptInvitation = async (req, res) => {
  const { token } = req.body;
  
  try {
    // Tìm lời mời dựa trên token
    const [[invitation]] = await db.query(
      `SELECT * FROM ProjectInvitations WHERE token = ? AND status = 'pending'`,
      [token]
    );
    
    if (!invitation) {
      return res.status(404).json({ message: 'Lời mời không tồn tại hoặc đã hết hạn' });
    }
    
    // Kiểm tra lời mời còn hiệu lực không
    if (new Date(invitation.expires_at) < new Date()) {
      await db.query(
        `UPDATE ProjectInvitations SET status = 'expired' WHERE invitation_id = ?`,
        [invitation.invitation_id]
      );
      return res.status(400).json({ message: 'Lời mời đã hết hạn' });
    }
    
    // Tìm người dùng với email này
    const [[user]] = await db.query('SELECT * FROM Users WHERE email = ?', [invitation.email]);
    
    let userId;
    
    if (!user) {
      // Nếu người dùng chưa có tài khoản, tạo tài khoản tạm thời
      // Hoặc có thể chuyển hướng người dùng đến trang đăng ký
      return res.status(404).json({ 
        message: 'Bạn cần đăng ký tài khoản trước khi tham gia dự án',
        email: invitation.email,
        requireRegistration: true
      });
    } else {
      userId = user.user_id;
    }
    
    // Thêm người dùng vào dự án
    await db.query(
      `INSERT INTO User_Project (user_id, project_id, role_id, status)
       VALUES (?, ?, ?, 'Active')`,
      [userId, invitation.project_id, invitation.role_id]
    );
    
    // Cập nhật trạng thái lời mời
    await db.query(
      `UPDATE ProjectInvitations SET status = 'accepted' WHERE invitation_id = ?`,
      [invitation.invitation_id]
    );
    
    res.status(200).json({ message: 'Đã tham gia dự án thành công' });
    
  } catch (err) {
    console.error('Error accepting invitation:', err);
    res.status(500).json({ message: 'Lỗi khi chấp nhận lời mời', error: err.message });
  }
};

// Lấy danh sách lời mời cho dự án
exports.getProjectInvitations = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.user_id;
  
  try {
    // Kiểm tra người dùng có quyền với dự án không
    const [[userAccess]] = await db.query(
      `SELECT * FROM User_Project 
       WHERE user_id = ? AND project_id = ? AND status = 'Active'`,
      [userId, projectId]
    );
    
    if (!userAccess) {
      return res.status(403).json({ message: 'Bạn không có quyền với dự án này' });
    }
    
    // Lấy danh sách lời mời
    const [invitations] = await db.query(
      `SELECT pi.*, u.full_name as inviter_name 
       FROM ProjectInvitations pi
       JOIN Users u ON pi.invited_by = u.user_id
       WHERE pi.project_id = ?
       ORDER BY pi.created_at DESC`,
      [projectId]
    );
    
    res.status(200).json(invitations);
    
  } catch (err) {
    console.error('Error getting invitations:', err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách lời mời', error: err.message });
  }
};

// Hủy lời mời
exports.cancelInvitation = async (req, res) => {
  const { invitationId } = req.params;
  const userId = req.user.user_id;
  
  try {
    // Lấy thông tin lời mời
    const [[invitation]] = await db.query(
      'SELECT * FROM ProjectInvitations WHERE invitation_id = ?',
      [invitationId]
    );
    
    if (!invitation) {
      return res.status(404).json({ message: 'Lời mời không tồn tại' });
    }
    
    // Kiểm tra người dùng có quyền với dự án không
    const [[userAccess]] = await db.query(
      `SELECT * FROM User_Project 
       WHERE user_id = ? AND project_id = ? AND status = 'Active'`,
      [userId, invitation.project_id]
    );
    
    if (!userAccess && invitation.invited_by !== userId) {
      return res.status(403).json({ message: 'Bạn không có quyền hủy lời mời này' });
    }
    
    // Hủy lời mời
    await db.query(
      `UPDATE ProjectInvitations SET status = 'cancelled' WHERE invitation_id = ?`,
      [invitationId]
    );
    
    res.status(200).json({ message: 'Đã hủy lời mời thành công' });
    
  } catch (err) {
    console.error('Error cancelling invitation:', err);
    res.status(500).json({ message: 'Lỗi khi hủy lời mời', error: err.message });
  }
};