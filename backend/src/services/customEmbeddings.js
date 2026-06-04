import { Embeddings } from '@langchain/core/embeddings';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class CustomGoogleEmbeddings extends Embeddings {
  constructor(apiKey) {
    super({});
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'embedding-001' });
  }

  async embedDocuments(texts) {
    const results = [];
    for (const text of texts) {
      if(!text.trim()){
         results.push(new Array(768).fill(0));
         continue;
      }
      try {
        const result = await this.model.embedContent(text);
        if (result.embedding && result.embedding.values) {
          results.push(result.embedding.values);
        } else {
          // fallback
          results.push(new Array(768).fill(0));
        }
      } catch (err) {
        console.error("Failed to embed:", err);
        results.push(new Array(768).fill(0));
      }
    }
    return results;
  }

  async embedQuery(text) {
    if(!text.trim()) return new Array(768).fill(0);
    const result = await this.model.embedContent(text);
    return result.embedding.values;
  }
}
