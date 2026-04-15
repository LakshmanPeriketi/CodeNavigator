import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  repoUrl: String,
  repoName: String,
  repoOwner: String,
  branch: { type: String, default: 'main' },
  status: {
    type: String,
    enum: ['pending', 'processing', 'ready', 'failed'],
    default: 'pending'
  },
  fileCount: Number,
  chunkCount: Number,
  vectorNamespace: String,
  llmProvider: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

sessionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Session = mongoose.model('Session', sessionSchema);
