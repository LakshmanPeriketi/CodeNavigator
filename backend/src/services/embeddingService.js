import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/huggingface_transformers';
import { ChatGroq } from '@langchain/groq';
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { env } from '../config/env.js';

export const getEmbeddingsModel = () => {
  if (env.LLM_PROVIDER === 'groq') {
    // Local HuggingFace Transformers logic eliminating API costs natively
    return new HuggingFaceTransformersEmbeddings({
      model: 'Xenova/all-MiniLM-L6-v2',
    });
  } else if (env.LLM_PROVIDER === 'openai') {
    return new OpenAIEmbeddings({
      openAIApiKey: env.OPENAI_API_KEY,
      model: 'text-embedding-3-small'
    });
  } else {
    // Anthropic uses OpenAI embeddings as requested by spec
    return new OpenAIEmbeddings({
      openAIApiKey: env.OPENAI_API_KEY,
      model: 'text-embedding-3-small'
    });
  }
};

export const getChatModel = () => {
  if (env.LLM_PROVIDER === 'groq') {
    return new ChatGroq({
      apiKey: env.GROQ_API_KEY,
      model: 'llama-3.1-8b-instant',
      temperature: 0,
    });
  } else if (env.LLM_PROVIDER === 'openai') {
    return new ChatOpenAI({
      openAIApiKey: env.OPENAI_API_KEY,
      modelName: 'gpt-4o',
      temperature: 0,
    });
  } else if (env.LLM_PROVIDER === 'anthropic') {
    return new ChatAnthropic({
      anthropicApiKey: env.ANTHROPIC_API_KEY,
      modelName: 'claude-3-5-sonnet-20240620',
      temperature: 0,
    });
  }
};
