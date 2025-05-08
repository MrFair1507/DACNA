// // middleware/authMiddleware.js
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const authenticate = (req, res, next) => {
//   const token = req.cookies.token;

//   if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(400).json({ message: 'Invalid token.' });
//   }
// };

// module.exports = authenticate;
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader && authHeader.split(" ")[1];
  const tokenFromCookie = req.cookies?.token;

  const token = tokenFromHeader || tokenFromCookie; // ✅ lấy từ cookie nếu không có header

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};
