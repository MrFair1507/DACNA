const db = require("../models/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendOTPEmail } = require("../utils/mailer"); // Import hàm gửi OTP
const { exportAllUsersToExcel } = require("../utils/exportExcel"); // Import hàm ghi vào file Excel
// exports.sendOTP = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Check if user exists
//     const [users] = await db.query("SELECT user_id, is_verified FROM Users WHERE email = ?", [email]);
//     if (users.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const user = users[0];

//     if (user.is_verified) {
//       return res.status(400).json({ message: 'Email already verified' });
//     }

//     // Always delete any old OTP (expired or not)
//     await db.query("DELETE FROM UserOTPs WHERE user_id = ?", [user.user_id]);

//     // Generate new OTP
//     const otp = crypto.randomInt(100000, 999999).toString();
//     const expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

//     // Insert new OTP
//     await db.query(
//       "INSERT INTO UserOTPs (user_id, otp_code, expires_at) VALUES (?, ?, ?)",
//       [user.user_id, otp, expires_at]
//     );

//     // Send email
//     await sendOTPEmail(email, otp);

//     res.status(200).json({ message: 'New OTP sent to email' });

//   } catch (err) {
//     console.error('❌ Error resending OTP:', err);
//     res.status(500).json({ message: 'Failed to resend OTP' });
//   }
// };

// Endpoint xác minh OTP
// exports.verifyOTP = async (req, res) => {
//     const { email, otp } = req.body;

//     try {
//       //  Tìm user theo email
//       const [users] = await db.query("SELECT user_id FROM Users WHERE email = ?", [email]);

//       if (users.length === 0) {
//         return res.status(404).json({ message: 'Email not found' });
//       }

//       const userId = users[0].user_id;

//       //  Lấy OTP mới nhất của user đó
//       const [otps] = await db.query(
//         "SELECT * FROM UserOTPs WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
//         [userId]
//       );

//       if (otps.length === 0) {
//         return res.status(400).json({ message: 'No OTP found for this user' });
//       }

//       const otpRecord = otps[0];

//       //  Kiểm tra OTP và hạn
//       if (otpRecord.otp_code !== otp) {
//         return res.status(400).json({ message: 'Invalid OTP' });
//       }

//       if (new Date(otpRecord.expires_at) < new Date()) {
//         return res.status(400).json({ message: 'OTP has expired' });
//       }

//       //  Cập nhật trạng thái verified của OTP và người dùng
//       await db.query("UPDATE UserOTPs SET verified = TRUE WHERE otp_id = ?", [otpRecord.otp_id]);
//       await db.query("UPDATE Users SET is_verified = 1 WHERE user_id = ?", [userId]);

//       //  // Ghi vào file Excel
//       // await exportAllUsersToExcel({
//       //   user_id: users.user_id,
//       //   full_name: users.full_name,
//       //   email: users.email,
//       //   password_hash: users.password_hash,
//       //   verified_at: new Date().toISOString()
//       // });

//       res.status(200).json({ message: 'OTP verified successfully. Your email is now confirmed.' });
//     } catch (err) {
//       console.error("Error verifying OTP:", err);
//       res.status(500).json({ error: 'Server error while verifying OTP' });
//     }
//   };

// exports.verifyOTP = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     const [[user]] = await db.query(
//       `SELECT * FROM Temp_Users WHERE email = ?`,
//       [email]
//     );

//     if (!user) return res.status(404).json({ message: 'No registration found' });
//     if (user.otp_code !== otp) return res.status(400).json({ message: 'Incorrect OTP' });

//     if (new Date(user.expires_at) < new Date()) {
//       // Xóa user đã hết hạn
//       await db.query("DELETE FROM Temp_Users WHERE email = ?", [email]);
//       return res.status(400).json({ message: 'OTP expired. Please register again.' });
//     }

//     // Di chuyển sang bảng chính
//     await db.query(
//       `INSERT INTO Users (full_name, email, password_hash, is_verified)
//        VALUES (?, ?, ?, ?)`,
//       [user.full_name, user.email, user.password_hash, 1]
//     );

//     // Xóa khỏi Temp_Users
//     await db.query("DELETE FROM Temp_Users WHERE email = ?", [email]);

//     res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'OTP verification failed' });
//   }
// };

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  // Log incoming verification request for debugging
  console.log("Verifying OTP:", { email, otp });

  try {
    const [[user]] = await db.query(
      `SELECT * FROM Temp_Users WHERE email = ?`,
      [email]
    );

    if (!user) {
      console.log("No registration found for:", email);
      return res
        .status(404)
        .json({ message: "No registration found for this email" });
    }

    if (user.otp_code !== otp) {
      console.log("Incorrect OTP provided:", otp);
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    if (new Date(user.expires_at) < new Date()) {
      // OTP expired
      await db.query("DELETE FROM Temp_Users WHERE email = ?", [email]);
      return res
        .status(400)
        .json({ message: "OTP expired. Please register again." });
    }

    // Move user from temp to permanent table
    await db.query(
      `INSERT INTO Users (full_name, email, password_hash, is_verified)
       VALUES (?, ?, ?, ?)`,
      [user.full_name, user.email, user.password_hash, 1]
    );

    // Delete from temp table
    await db.query("DELETE FROM Temp_Users WHERE email = ?", [email]);

    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ error: "OTP verification failed" });
  }
};
exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const [[user]] = await db.query(
      `SELECT * FROM Temp_Users WHERE email = ?`,
      [email]
    );
    if (!user)
      return res.status(404).json({ message: "No registration found" });

    const otp = crypto.randomInt(100000, 999999).toString();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    await db.query(
      `UPDATE Temp_Users SET otp_code = ?, expires_at = ? WHERE email = ?`,
      [otp, expires_at, email]
    );

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "New OTP has been sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};
