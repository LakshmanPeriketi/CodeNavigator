import { Chroma } from '@langchain/community/vectorstores/chroma';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { getEmbeddingsModel } from './embeddingService.js';
import { env } from '../config/env.js';
import { logger } from '../config/db.js';

let pineconeClient = null;

const getChromaConfig = (sessionId) => {
  return {
    collectionName: sessionId,
    url: env.CHROMA_URL
  };
};

export const storeDocuments = async (docs, sessionId) => {
  const embeddings = getEmbeddingsModel();

  if (env.VECTOR_STORE === 'pinecone') {
    if (!pineconeClient) {
      pineconeClient = new Pinecone({ apiKey: env.PINECONE_API_KEY });
    }
    const pineconeIndex = pineconeClient.Index(env.PINECONE_INDEX);
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex,
      namespace: sessionId
    });
  } else {
    try {
      await Chroma.fromDocuments(docs, embeddings, getChromaConfig(sessionId));
    } catch (e) {
      // Check for dimension mapping error (e.g., migrating from 768 to 384 dims)
      if (e.message && e.message.toLowerCase().includes('dimension')) {
        logger.warn(`Dimension mismatch detected for ${sessionId}. Resetting Chroma collection cleanly...`);
        const vectorStore = new Chroma(embeddings, getChromaConfig(sessionId));
        try {
          await vectorStore.delete({ collectionName: sessionId });
        } catch(deleteErr) {
          logger.warn(`Secondary warning while resetting dimension collection: ${deleteErr.message}`);
        }
        await Chroma.fromDocuments(docs, embeddings, getChromaConfig(sessionId));
      } else {
        throw e;
      }
    }
  }
};

export const getRetriever = async (sessionId) => {
  const embeddings = getEmbeddingsModel();

  if (env.VECTOR_STORE === 'pinecone') {
    if (!pineconeClient) {
      pineconeClient = new Pinecone({ apiKey: env.PINECONE_API_KEY });
    }
    const pineconeIndex = pineconeClient.Index(env.PINECONE_INDEX);
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: sessionId
    });
    return vectorStore.asRetriever({ k: 8, filter: { sessionId } });
  } else {
    const vectorStore = new Chroma(embeddings, getChromaConfig(sessionId));
    return vectorStore.asRetriever({ k: 8 });
  }
};
