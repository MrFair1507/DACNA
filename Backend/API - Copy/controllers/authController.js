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
    const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    if (rows.length > 0) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user (inactive or not verified)
    const [result] = await db.query(
      "INSERT INTO Users (full_name, email, password_hash, is_verified) VALUES (?, ?, ?, ?)",
      [full_name, email, hashedPassword, 0]
    );

    const userId = result.insertId;

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = Date.now() + parseInt(process.env.OTP_EXPIRES_IN);

    // Save OTP to DB (you need an OTP table or add to Users)
    await db.query(
      "INSERT INTO UserOTPs (user_id, otp_code, expires_at) VALUES (?, ?, ?)",
      [userId, otp, new Date(otpExpiresAt)]
    );

    // Send email
    await sendOTPEmail(email, otp);

    res.status(201).json({
      message: 'User registered. Please check your email for the OTP code.',
      user_id: userId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
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

    // Kiểm tra người dùng đã xác minh email chưa
    if (!user.is_verified) {
      return res.status(403).json({ message: 'Email not verified. Please verify your email first.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Tạo access token bằng hàm generateToken
    const token = generateToken(user);

    // Cập nhật lần đăng nhập cuối
    await db.query("UPDATE Users SET last_login = NOW() WHERE user_id = ?", [user.user_id]);

    // Trả về token và thông tin người dùng
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
