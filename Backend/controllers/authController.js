//AuthController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../models/db'); // File connect MySQL
const { sendOTPEmail } = require('../utils/mailer'); // File send email
const { generateToken } = require('../utils/jwt'); // File tạo token
require('dotenv').config();




// exports.register = async (req, res) => {
//   const { full_name, email, password } = req.body;

//   try {
//     const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
//     if (rows.length > 0) return res.status(400).json({ message: 'Email already registered' });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save user (inactive or not verified)
//     const [result] = await db.query(
//       "INSERT INTO Users (full_name, email, password_hash, is_verified) VALUES (?, ?, ?, ?)",
//       [full_name, email, hashedPassword, 0]
//     );

//     const userId = result.insertId;

//     // Generate OTP
//     const otp = crypto.randomInt(100000, 999999).toString();
//     const otpExpiresAt = Date.now() + parseInt(process.env.OTP_EXPIRES_IN);

//     // Save OTP to DB (you need an OTP table or add to Users)
//     await db.query(
//       "INSERT INTO UserOTPs (user_id, otp_code, expires_at) VALUES (?, ?, ?)",
//       [userId, otp, new Date(otpExpiresAt)]
//     );

//     // Send email
//     await sendOTPEmail(email, otp);

//     res.status(201).json({
//       message: 'User registered. Please check your email for the OTP code.',
//       user_id: userId
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };
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
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    // Lưu vào cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // 👉 đặt true nếu dùng HTTPS
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000 // 1 giờ
    });

    // Cập nhật thời gian đăng nhập cuối
    await db.query("UPDATE Users SET last_login = NOW() WHERE user_id = ?", [user.user_id]);

    // Gửi phản hồi thành công
    res.status(200).json({
      message: 'Login successful',
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
