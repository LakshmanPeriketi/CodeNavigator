import { getChatModel } from './embeddingService.js';
import { getRetriever } from './vectorStoreService.js';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { logger } from '../config/db.js';

const formatDocs = (docs) => {
  return docs.map((doc, idx) => `--- Document ${idx + 1} (${doc.metadata.source}) ---\n${doc.pageContent}`).join('\n\n');
};

const extractSources = (docs) => {
  return docs.map(doc => {
    return {
      file: doc.metadata.source || 'unknown',
      lines: doc.metadata.loc?.lines ? `${doc.metadata.loc.lines.from}-${doc.metadata.loc.lines.to}` : 'N/A',
      snippet: doc.pageContent.substring(0, 300) + '...'
    };
  });
};

export const createAgent = (callbacks) => {
  return {
    invoke: async ({ query, sessionId, repoName }) => {
      try {
        const llm = getChatModel();
        const retriever = await getRetriever(sessionId);
        
        // 1. Retrieve the nearest context documents natively from Vector DB
        const retrievedDocs = await retriever.invoke(query);

        // 2. Dispatch exactly the sources requested over custom SSE bounds
        if (callbacks?.onSources) {
          callbacks.onSources(extractSources(retrievedDocs));
        }

        // 3. Structure functional prompt logic cleanly mimicking LangGraph prompts
        const contextStr = formatDocs(retrievedDocs);
        const systemPrompt = `You are CodeNavigator, an expert software engineer AI assistant.
You are actively analyzing the GitHub repository: ${repoName}.

Using the following code context retrieved from the repository:
${contextStr}

Answer the user's question clearly and precisely.
- Reference specific file paths when mentioning code
- Use markdown formatting with code blocks for any code snippets
- Be concise but highly accurate and specific
- If the context doesn't contain enough information, state exactly what is missing`;

        const messages = [
          new SystemMessage(systemPrompt),
          new HumanMessage(`Question: ${query}`)
        ];

        let fullAnswer = '';
        const stream = await llm.stream(messages);
        
        // 4. Stream back seamlessly maintaining previous abstraction hooks
        for await (const chunk of stream) {
          if (callbacks?.onContent) {
            callbacks.onContent(chunk.content);
          }
          fullAnswer += chunk.content;
        }

        return { answer: fullAnswer };
      } catch (error) {
        logger.error(`Error in linear Groq RAG chain stream: ${error.message}`);
        throw error;
      }
    }
  };
};
