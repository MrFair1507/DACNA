// File: jobs/cleanupTempUsers.js
const db = require('../models/db');

const cleanupTempUsers = async () => {
  try {
    const [result] = await db.query("DELETE FROM Temp_Users WHERE expires_at < NOW()");
    if (result.affectedRows > 0) {
      console.log(`🧹 [CLEANUP] Removed ${result.affectedRows} expired Temp_Users`);
    }
  } catch (err) {
    console.error('❌ Error in cleanup job:', err.message);
  }
};

module.exports = cleanupTempUsers;
