// File: routes/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const otpController = require('../controllers/otpController');
const requestLogger = require('../middleware/requestLogger');
const authenticate = require('../middleware/authMiddleware');
const passport = require('passport');
const { generateToken } = require('../utils/jwt');


router.use(authenticate);      // Xác thực trước
router.use(requestLogger);     // Ghi log sau khi biết người dùng


// Public
router.post('/register', authController.register);
router.post('/login', authController.login);

// OTP (Email Verification)
router.post('/send-otp', otpController.sendOTP);     // Gửi lại OTP qua email
router.post('/verify-otp', otpController.verifyOTP); // Xác minh OTP

// passport Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  }
);

// passport Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['public_profile'] }));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  }
);



// delete account by this url 
router.delete('/delete-account', authenticate, async (req, res) => {
  const userId = req.user.user_id;

  try {
    // Xoá các dữ liệu liên quan trước nếu cần (VD: comments, projects, v.v.)
    await db.query("DELETE FROM Users WHERE user_id = ?", [userId]);
    res.json({ message: 'Tài khoản đã được xoá thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Xảy ra lỗi khi xoá tài khoản' });
  }
});

// Protected
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});





module.exports = router;
