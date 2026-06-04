import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'] },
    content: String,
    sources: [{
      file: String,
      lines: String,
      snippet: String
    }],
    timestamp: { type: Date, default: Date.now }
  }]
});

export const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
