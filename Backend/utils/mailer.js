const nodemailer = require('nodemailer');
require('dotenv').config();

// ✅ Cấu hình Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,        // Ví dụ: huynhcongbi04@gmail.com
    pass: process.env.EMAIL_PASS         // App password: ví dụ: "hjbo osoc rkjq uuxh"
  }
});

// ✅ Gửi OTP qua email
const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: `"Task Management" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP Code',
    html: `
      <h3>Mã OTP của bạn là: <strong>${otp}</strong></h3>
      <p>Mã có hiệu lực trong 5 phút.</p>
    `
  };
  return transporter.sendMail(mailOptions);
};

// ✅ Gửi lời mời tham gia dự án
const sendInvitationEmail = async (to, projectName) => {
  const subject = `Lời mời tham gia dự án: ${projectName}`;
  const html = `
    <h3>Xin chào,</h3>
    <p>Bạn được mời tham gia dự án <strong>${projectName}</strong>.</p>
    <p>Vui lòng đăng ký tài khoản để tham gia:</p>
    <a href="https://localhost:5173/register?email=${encodeURIComponent(to)}"
       style="display:inline-block; padding:10px 20px; background-color:#4CAF50; color:white; text-decoration:none; border-radius:4px;">
       Đăng ký ngay
    </a>
  `;

  return transporter.sendMail({
    from: `"Task Management" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

// ✅ Export cả hai
module.exports = {
  sendOTPEmail,
  sendInvitationEmail
};
