import { v4 as uuidv4 } from 'uuid';
import { Session } from '../models/Session.js';
import { ingestRepository } from '../services/githubService.js';
import { env } from '../config/env.js';

export const startIngestion = async (req, res, next) => {
  try {
    const { githubUrl, branch = 'main' } = req.body;

    if (!githubUrl) {
      return res.status(400).json({ error: true, message: 'githubUrl is required' });
    }

    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      return res.status(400).json({ error: true, message: 'Invalid GitHub URL format' });
    }

    const repoOwner = match[1];
    const repoName = match[2].replace('.git', '');
    const sessionId = uuidv4();

    const session = new Session({
      sessionId,
      repoUrl: githubUrl,
      repoOwner,
      repoName: `${repoOwner}/${repoName}`,
      branch,
      status: 'processing',
      vectorNamespace: sessionId,
      llmProvider: env.LLM_PROVIDER
    });

    await session.save();

    // Kick off background processing
    ingestRepository(githubUrl, branch, sessionId).catch((err) => {
      console.error(`Background ingestion error for ${sessionId}: `, err);
    });

    res.status(202).json({
      sessionId,
      status: 'processing',
      repoName: session.repoName
    });

  } catch (error) {
    next(error);
  }
};

export const getIngestionStatus = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({ error: true, message: 'Session not found' });
    }

    res.status(200).json({
      sessionId: session.sessionId,
      status: session.status,
      repoName: session.repoName,
      fileCount: session.fileCount,
      chunkCount: session.chunkCount
    });

  } catch (error) {
    next(error);
  }
};
