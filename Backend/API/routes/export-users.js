// routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { exportAllUsersToExcel } = require('../utils/exportExcel');

router.get('/', async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM Users");
    await exportAllUsersToExcel(users);
    res.status(200).json({ message: 'Exported to Excel successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
