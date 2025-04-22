const db = require('../models/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendOTPEmail } = require('../utils/mailer'); // Import hàm gửi OTP
const  {exportAllUsersToExcel}  = require('../utils/exportExcel'); // Import hàm ghi vào file Excel
exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Tìm user trong bảng Users
    const [users] = await db.query("SELECT user_id, is_verified FROM Users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const user = users[0];

    if (user.is_verified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // 2. Tạo OTP ngẫu nhiên
    const otp = crypto.randomInt(100000, 999999).toString();

    // 3. Tính thời gian hết hạn
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    // 4. Lưu vào bảng UserOTPs
    await db.query(
      "INSERT INTO UserOTPs (user_id, otp_code, expires_at) VALUES (?, ?, ?)",
      [user.user_id, otp, expiresAt]
    );

    // 5. Gửi email
    await sendOTPEmail(email, otp);
    
    

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};


// Endpoint xác minh OTP
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      //  Tìm user theo email
      const [users] = await db.query("SELECT user_id FROM Users WHERE email = ?", [email]);
  
      if (users.length === 0) {
        return res.status(404).json({ message: 'Email not found' });
      }
  
      const userId = users[0].user_id;
  
      //  Lấy OTP mới nhất của user đó
      const [otps] = await db.query(
        "SELECT * FROM UserOTPs WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
        [userId]
      );
  
      if (otps.length === 0) {
        return res.status(400).json({ message: 'No OTP found for this user' });
      }
  
      const otpRecord = otps[0];
  
      //  Kiểm tra OTP và hạn
      if (otpRecord.otp_code !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      if (new Date(otpRecord.expires_at) < new Date()) {
        return res.status(400).json({ message: 'OTP has expired' });
      }
  
      //  Cập nhật trạng thái verified của OTP và người dùng
      await db.query("UPDATE UserOTPs SET verified = TRUE WHERE otp_id = ?", [otpRecord.otp_id]);
      await db.query("UPDATE Users SET is_verified = 1 WHERE user_id = ?", [userId]);
      
      //  // Ghi vào file Excel
      // await exportAllUsersToExcel({
      //   user_id: users.user_id,
      //   full_name: users.full_name,
      //   email: users.email,
      //   password_hash: users.password_hash,
      //   verified_at: new Date().toISOString()
      // });

      res.status(200).json({ message: 'OTP verified successfully. Your email is now confirmed.' });
    } catch (err) {
      console.error("Error verifying OTP:", err);
      res.status(500).json({ error: 'Server error while verifying OTP' });
    }
  };
  
