//AuthController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../models/db'); // File connect MySQL
const { sendOTPEmail } = require('../utils/mailer'); // File send email
const { generateToken } = require('../utils/jwt'); // File tạo token
require('dotenv').config();

exports.register = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    // Kiểm tra email đã tồn tại ở cả bảng chính và tạm
    const [[checkMain]] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    const [[checkTemp]] = await db.query("SELECT * FROM Temp_Users WHERE email = ?", [email]);

    if (checkMain) return res.status(400).json({ message: 'Email already registered' });
    if (checkTemp) return res.status(400).json({ message: 'OTP already sent. Please verify first.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    await db.query(
      `INSERT INTO Temp_Users (full_name, email, password_hash, otp_code, expires_at)
       VALUES (?, ?, ?, ?, ?)`,
      [full_name, email, hashedPassword, otp, expiresAt]
    );

    await sendOTPEmail(email, otp);
    console.log(`OTP sent to ${email}: ${otp}`); // Log OTP for debugging
    res.status(200).json({ message: 'OTP sent to email. Please verify within 10 minutes.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error during registration' });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    const user = rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.is_verified) {
      return res.status(403).json({ message: 'Email not verified. Please verify your email first.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Tạo access token
    console.log("🔐 JWT_SECRET used in authController:", process.env.JWT_SECRET);
    const token = generateToken(user);
    // Lưu vào cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // 👉 đặt true nếu dùng HTTPS
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000 // 1 giờ
    });

    // Cập nhật thời gian đăng nhập cuối
    await db.query("UPDATE Users SET last_login = NOW() WHERE user_id = ?", [user.user_id]);

    // Gửi phản hồi thành công
    res.status(200).json({
      message: 'Login successful',
      token, // ✅ ADD THIS
      user: {
        id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
    

  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ error: 'Login failed' });
  }
};
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
//     const user = rows[0];

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     // Kiểm tra người dùng đã xác minh email chưa
//     if (!user.is_verified) {
//       return res.status(403).json({ message: 'Email not verified. Please verify your email first.' });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password_hash);
//     if (!passwordMatch) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     // Tạo access token bằng hàm generateToken
//     const token = generateToken(user);

//     // Cập nhật lần đăng nhập cuối
//     await db.query("UPDATE Users SET last_login = NOW() WHERE user_id = ?", [user.user_id]);

//     // Trả về token và thông tin người dùng
//     res.status(200).json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user.user_id,
//         full_name: user.full_name,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};


exports.getProfile = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const [rows] = await db.query("SELECT * FROM Users WHERE user_id = ?", [userId]);

    if (!rows || rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    const user = rows[0];

    res.json({
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      phone_number: user.phone_number || null,
      status: user.status || null,
      is_verified: user.is_verified,
      created_at: user.created_at,
      last_login: user.last_login,
    });
  } catch (err) {
    console.error("❌ Error in /auth/me:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
