const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
   console.log("🔐 JWT_SECRET used in generateToken:", process.env.JWT_SECRET);
  return jwt.sign(
    { user_id: user.user_id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
    
  );
};
