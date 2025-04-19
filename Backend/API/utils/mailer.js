// utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

console.log("User:", process.env.EMAIL_USER);
console.log("Pass:", process.env.EMAIL_PASS ? 'Loaded' : 'Missing');


const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your OTP Code',
    html: `<h3>Your OTP Code is: <strong>${otp}</strong></h3><p>It will expire in 5 minutes.</p>`
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
