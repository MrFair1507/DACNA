const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cron = require('node-cron');
const cookieParser = require('cookie-parser');
require('./middlewares/passport'); // GỌI TRƯỚC KHI DÙNG

const app = express();

require('dotenv').config();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // địa chỉ frontend của bạn
  credentials: true,               // cho phép gửi cookie, token
}));

app.use(session({ secret: 'oauth_secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser()); // ✅ Đọc cookie

// Import route
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/userRoutes', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/task-assignments', require('./routes/taskAssignments'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/attachments', require('./routes/attachments'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/sprints', require('./routes/sprints'));
app.use('/api/export-users', require('./routes/export-users'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// cron
cron.schedule('*/10 * * * *', require("./jobs/cleanupTempUsers")); // Mỗi 5 phút



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
