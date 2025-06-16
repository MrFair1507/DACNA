const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Caotri90!",
  database: "taskmanagement",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool.promise();
