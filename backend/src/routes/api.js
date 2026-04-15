import express from 'express';
import { startIngestion, getIngestionStatus } from '../controllers/ingestController.js';
import { handleChat } from '../controllers/chatController.js';
import { ingestLimiter, chatLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/ingest', ingestLimiter, startIngestion);
router.get('/ingest/status/:sessionId', getIngestionStatus);
router.post('/chat', chatLimiter, handleChat);

export default router;
