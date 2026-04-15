import mongoose from 'mongoose';
import { env } from './env.js';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export { logger };
