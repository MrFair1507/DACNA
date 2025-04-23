const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'Thangbi1507',
  database: 'TaskManagement',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool.promise();
