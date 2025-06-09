const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cron = require('node-cron');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs'); // ✅ import file system module
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
app.use('/api/auth', require('./routes/auth_forgot'));
app.use('/api/reports', require('./routes/report'));
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
app.use('/api', require('./routes/sprintBacklog'));
app.use('/api/export-users', require('./routes/export-users'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// cron
cron.schedule('*/10 * * * *', require("./jobs/cleanupTempUsers")); // Mỗi 5 phút

// const sslOptions = {
//   key: process.env.SSL_KEY_PATH, // Đường dẫn đến file khóa riêng
//   cert: process.env.SSL_CERT_PATH, // Đường dẫn đến file chứng chỉ SSL
// };

// console.log(sslOptions.key, sslOptions.cert);

// const PORT = 3000;
// https.createServer(sslOptions, app).listen(PORT, () => {
//   console.log('✅ HTTPS server running at https://localhost:3000');
// });

const key = fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8');
const cert = fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8');

// https.createServer({ key, cert }, app).listen(3000, () => {
//   console.log('HTTPS server running at https://localhost:3000');
// });


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ HTTP server running at http://localhost:${PORT}`);
});