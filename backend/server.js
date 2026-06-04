import app from './src/app.js';
import { connectDB, logger } from './src/config/db.js';
import { env } from './src/config/env.js';

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });
};

startServer();
