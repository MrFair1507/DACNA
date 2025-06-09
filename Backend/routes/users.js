// File: routes/users.js

const express = require('express');
const router = express.Router();
const db = require('../models/db');
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');
const requestLogger = require('../middlewares/requestLogger');


router.use(authenticate);      // Xác thực trước
router.use(requestLogger);     // Ghi log sau khi biết người dùng

router.get('/me', authenticate, requestLogger, userController.getMyProfile);
router.get('/all', authenticate, requestLogger, userController.getAllUsers);

module.exports = router;
