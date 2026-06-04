import { logger } from '../config/db.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
  
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).json({
    error: true,
    message: err.message || 'Internal Server Error',
    code: err.statusCode || 500
  });
};
