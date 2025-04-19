// utils/logger.js
const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, '../logs/api.log'), level: 'info' }),
    new transports.Console({ level: 'info' }) // In ra console luôn nếu muốn
  ]
});

module.exports = logger;
