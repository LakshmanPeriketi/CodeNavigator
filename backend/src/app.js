import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';
import { env } from './config/env.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.use('/api', apiRoutes);

app.use(errorHandler);

// Triggering restart for env change
export default app;
