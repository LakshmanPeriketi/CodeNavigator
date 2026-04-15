import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { env } from '../config/env.js';
import { Session } from '../models/Session.js';
import { storeDocuments } from './vectorStoreService.js';
import { logger } from '../config/db.js';

export const ingestRepository = async (githubUrl, branch, sessionId) => {
  try {
    const session = await Session.findOne({ sessionId });
    if (!session) throw new Error('Session not found');

    const loaderOptions = {
      branch,
      recursive: true,
      unknown: 'warn',
      ignorePaths: [
        '*.png', '*.jpg', '*.jpeg', '*.gif', '*.svg', '*.ico', '*.lock', '*.sum',
        'node_modules', 'dist', 'build', '.git', '.github', '.vscode'
      ]
    };

    if (env.GITHUB_TOKEN) {
      loaderOptions.accessToken = env.GITHUB_TOKEN;
    }

    let docs = [];
    try {
      const loader = new GithubRepoLoader(githubUrl, loaderOptions);
      logger.info(`Started loading repository: ${githubUrl} on branch ${branch}`);
      docs = await loader.load();
    } catch (e) {
      if (e.message && e.message.includes('404') && branch === 'main') {
        logger.info(`Branch main not found, attempting master...`);
        loaderOptions.branch = 'master';
        const fallbackLoader = new GithubRepoLoader(githubUrl, loaderOptions);
        docs = await fallbackLoader.load();
      } else {
        throw e;
      }
    }

    logger.info(`Loaded ${docs.length} files from repository`);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ['\nclass ', '\nfunction ', '\nconst ', '\nexport ', '\n\n', '\n', ' ']
    });

    const splitDocs = await splitter.splitDocuments(docs);

    const chunkedDocs = splitDocs
      .filter(doc => doc.pageContent && doc.pageContent.trim().length > 0)
      .map(doc => {
      doc.metadata = {
        ...doc.metadata,
        source: doc.metadata.source,
        repo: session.repoName,
        sessionId
      };
      return doc;
    });

    logger.info(`Split files into ${chunkedDocs.length} chunks. Starting vector storage...`);

    const batchSize = 50;
    for (let i = 0; i < chunkedDocs.length; i += batchSize) {
      const batch = chunkedDocs.slice(i, i + batchSize);
      await storeDocuments(batch, sessionId);
      logger.info(`Stored batch ${i / batchSize + 1}/${Math.ceil(chunkedDocs.length / batchSize)}`);
    }

    session.fileCount = docs.length;
    session.chunkCount = chunkedDocs.length;
    session.status = 'ready';
    await session.save();

    logger.info(`Ingestion completed for session: ${sessionId}`);

  } catch (error) {
    logger.error(`Ingestion failed for session ${sessionId}: ${error.message}`);
    await Session.updateOne({ sessionId }, { status: 'failed' });
  }
};
