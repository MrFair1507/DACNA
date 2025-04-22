const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const user = req.user || { email: 'Unknown', user_id: 'Unknown' };
  const logMessage = `${user.email} (${user.user_id}) - [${req.method}] ${req.originalUrl}`;
  
  logger.info(logMessage);

  next();
};

module.exports = requestLogger;