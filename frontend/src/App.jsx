import { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import IngestionLoader from './components/IngestionLoader';
import LandingPage from './components/LandingPage';
import { ingestRepo } from './services/api';

const initialRepoData = {
  name: '',
  url: '',
  sessionId: ''
};

const getRepoNameFromUrl = (url) => {
  if (!url) return 'repository';
  try {
    const parsedUrl = new URL(url);
    const segments = parsedUrl.pathname.split('/').filter(Boolean);
    return segments[1] || segments[0] || 'repository';
  } catch {
    return 'repository';
  }
};

const normalizeRepoData = (githubUrl, payload) => ({
  name: payload?.repoName || getRepoNameFromUrl(githubUrl),
  url: githubUrl,
  sessionId: payload?.sessionId || ''
});

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [repoData, setRepoData] = useState(initialRepoData);
  const [ingestionStatus, setIngestionStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleIngestRepository = async (githubUrl) => {
    setErrorMessage('');
    setRepoData({
      name: getRepoNameFromUrl(githubUrl),
      url: githubUrl,
      sessionId: ''
    });
    setIngestionStatus('loading'); // Show loader immediately

    try {
      const payload = await ingestRepo(githubUrl);
      setRepoData(normalizeRepoData(githubUrl, payload));
      // Stay in 'loading' status, allow IngestionLoader to poll
    } catch (error) {
      setIngestionStatus('error');
      setErrorMessage(
        error?.message || 'Something went wrong while starting repository ingestion.'
      );
    }
  };

  const handleIngestionComplete = () => {
    setIngestionStatus('success');
    setCurrentView('chat');
  };

  const handleIngestionFailed = (msg) => {
    setIngestionStatus('error');
    setErrorMessage(msg || 'Ingestion failed while processing source files.');
    setCurrentView('landing');
  };

  const handleAnalyzeNewRepo = () => {
    setCurrentView('landing');
    setRepoData(initialRepoData);
    setIngestionStatus('idle');
    setErrorMessage('');
  };

  if (ingestionStatus === 'loading') {
    return (
      <IngestionLoader 
        repoName={repoData.name || 'Preparing repository'} 
        sessionId={repoData.sessionId} 
        onComplete={handleIngestionComplete}
        onFail={handleIngestionFailed}
      />
    );
  }

  if (currentView === 'chat' && repoData.sessionId) {
    return (
      <ChatInterface
        onAnalyzeNewRepo={handleAnalyzeNewRepo}
        repoData={repoData}
      />
    );
  }

  return (
    <LandingPage
      errorMessage={errorMessage}
      ingestionStatus={ingestionStatus}
      onSubmit={handleIngestRepository}
    />
  );
}

export default App;
