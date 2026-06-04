import axios from 'axios';

const legacyProcessEnv =
  typeof globalThis !== 'undefined' ? globalThis.process?.env : undefined;

const BASE_URL =
  legacyProcessEnv?.REACT_APP_API_URL ||
  import.meta.env?.VITE_API_URL ||
  'http://localhost:5000';

export const ingestRepo = async (githubUrl, branch = 'main') => {
  try {
    const response = await fetch(`${BASE_URL}/api/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ githubUrl, branch })
    });
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Unable to ingest this repository right now.');
  }
};

export const pollIngestionStatus = async (sessionId) => {
  const res = await fetch(`${BASE_URL}/api/ingest/status/${sessionId}`);
  return res.json();
};

export const sendMessage = async (query, sessionId, onChunk, onSources, onDone) => {
  try {
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        sessionId
      })
    });

    if (!response.ok) {
      throw new Error('Unable to send message right now.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        if(onDone) { onDone(); }
        break;
      }
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n\r?\n/);
      buffer = lines.pop() || '';
      
      for (const block of lines) {
        if (!block.trim()) continue;
        const lineData = block.split('\n').filter(l => l.startsWith('data: '));
        for (const line of lineData) {
          const jsonStr = line.replace('data: ', '').trim();
          if (!jsonStr) continue;
          
          try {
            const data = JSON.parse(jsonStr);
            if (data.type === 'token') {
              onChunk(data.content);
            }
            if (data.type === 'sources') {
              if (onSources) onSources(data.sources);
            }
            if (data.type === 'done') {
              if (onDone) onDone();
            }
          } catch(e) {
            // ignore parse errors for partial json
          }
        }
      }
    }
  } catch(e) {
    throw e;
  }
};
