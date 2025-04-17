const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const SECRET_KEY = 'mysecret123';

// ⚡ Danh sách người dùng mẫu
const users = [
  { id: 1, username: 'alice', password: '123', role: 'admin' },
  { id: 2, username: 'bob', password: '456', role: 'user' },
  { id: 3, username: 'charlie', password: '789', role: 'editor' }
];

// Đăng nhập
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Tìm người dùng trong danh sách
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu' });
  }

  // Tạo token
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, {
    expiresIn: '1h'
  });

  res.json({ token });
});

// Route yêu cầu xác thực
app.get('/protected', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Không có token' });

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token không hợp lệ' });

    res.json({ message: 'Truy cập thành công', user: decoded });
  });
});

app.listen(3000, () => console.log('✅ Server chạy tại http://localhost:3000'));
