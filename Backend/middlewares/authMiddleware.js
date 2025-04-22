const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Không có token xác thực' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('Decoded token:', req.user);
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }
};

module.exports = authenticate;
