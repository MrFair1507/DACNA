const express = require("express");
const router = express.Router();
const db = require("../models/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendOTPEmail } = require("../utils/mailer");

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const [[user]] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    if (!user) return res.status(404).json({ message: "Email không tồn tại" });

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    await db.query("INSERT INTO UserOTPs (user_id, otp_code, expires_at, purpose) VALUES (?, ?, ?, ?)",
      [user.user_id, otp, expiresAt, "reset_password"]
    );

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP đặt lại mật khẩu đã được gửi tới email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi gửi OTP" });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  const { email, otp, new_password } = req.body;

  try {
    // 1. Tìm người dùng theo email
    const [[user]] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    // 2. Kiểm tra mã OTP có hợp lệ không
    const [[otpRecord]] = await db.query(
      `SELECT * FROM UserOTPs 
       WHERE user_id = ? AND otp_code = ? 
       AND purpose = 'reset_password' AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [user.user_id, otp]
    );

    if (!otpRecord) return res.status(400).json({ message: "OTP không hợp lệ hoặc đã hết hạn" });

    // 3. Hash mật khẩu mới
    const hashed = await bcrypt.hash(new_password, 10);

    // 4. Cập nhật mật khẩu
    await db.query("UPDATE Users SET password_hash = ? WHERE user_id = ?", [hashed, user.user_id]);

    // 5. Xóa OTP sau khi dùng
    await db.query("DELETE FROM UserOTPs WHERE user_id = ?", [user.user_id]);

    res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
  } catch (err) {
    console.error("❌ Lỗi đặt lại mật khẩu:", err);
    res.status(500).json({ message: "Lỗi đặt lại mật khẩu" });
  }
});

module.exports = router;