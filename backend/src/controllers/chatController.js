import { Session } from '../models/Session.js';
import { ChatHistory } from '../models/ChatHistory.js';
import { createAgent } from '../services/agentService.js';

export const handleChat = async (req, res, next) => {
  try {
    const { query, sessionId } = req.body;

    if (!query || !sessionId) {
      return res.status(400).json({ error: true, message: 'query and sessionId are required' });
    }

    const session = await Session.findOne({ sessionId });
    if (!session || session.status !== 'ready') {
      return res.status(400).json({ error: true, message: 'Invalid session or repo not ready' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    let sourcesCaptured = [];

    const callbacks = {
      onContent: (content) => {
        res.write(`data: ${JSON.stringify({ type: 'token', content })}\n\n`);
      },
      onSources: (sources) => {
        sourcesCaptured = sources;
        res.write(`data: ${JSON.stringify({ type: 'sources', sources })}\n\n`);
      }
    };

    const agent = createAgent(callbacks);

    const result = await agent.invoke({
      query,
      sessionId,
      repoName: session.repoName,
      retryCount: 0
    });

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();

    let chatDoc = await ChatHistory.findOne({ sessionId });
    if(!chatDoc) {
      chatDoc = new ChatHistory({ sessionId, messages: [] });
    }

    chatDoc.messages.push({
      role: 'user',
      content: query
    });

    chatDoc.messages.push({
      role: 'assistant',
      content: result.answer,
      sources: sourcesCaptured
    });

    await chatDoc.save();

  } catch (error) {
    next(error);
  }
};
