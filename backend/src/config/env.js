import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/codenavigator',
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY,
  PINECONE_INDEX: process.env.PINECONE_INDEX,
  LLM_PROVIDER: process.env.LLM_PROVIDER || 'google',
  VECTOR_STORE: process.env.VECTOR_STORE || 'chroma',
  CHROMA_URL: process.env.CHROMA_URL || 'http://localhost:8000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};
