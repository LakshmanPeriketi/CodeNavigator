import { useEffect, useState } from 'react';
import { pollIngestionStatus } from '../services/api';

const steps = [
  'Cloning repository...',
  'Parsing source files...',
  'Chunking code intelligently...',
  'Generating embeddings...',
  'Storing in vector database...'
];

function IngestionLoader({ repoName, sessionId, onComplete, onFail }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(4);

  useEffect(() => {
    if (!sessionId) return;

    let pollInterval;
    
    const checkStatus = async () => {
      try {
        const data = await pollIngestionStatus(sessionId);
        if (data.status === 'ready') {
          clearInterval(pollInterval);
          setProgress(100);
          setTimeout(() => onComplete(), 500);
        } else if (data.status === 'failed') {
          clearInterval(pollInterval);
          onFail('The backend reported a failure while ingesting the repository.');
        } else {
          // just let visual progress and steps flip
        }
      } catch (err) {
        // ignore fetch fails immediately, keep trying
      }
    };

    pollInterval = setInterval(checkStatus, 3000);

    return () => clearInterval(pollInterval);
  }, [sessionId, onComplete, onFail]);

  // Visual simulation for progress bar and text cycle
  useEffect(() => {
    const stepInterval = window.setInterval(() => {
      setCurrentStepIndex((previousIndex) => (previousIndex + 1) % steps.length);
    }, 2000);

    const progressInterval = window.setInterval(() => {
      setProgress((previousProgress) =>
        previousProgress >= 94 ? 94 : previousProgress + 1
      );
    }, 150);

    return () => {
      window.clearInterval(stepInterval);
      window.clearInterval(progressInterval);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0d1117] px-6 text-[#e6edf3]">
      <div className="w-full max-w-3xl rounded-[2rem] border border-[#30363d] bg-[#161b22]/90 p-8 shadow-[0_32px_80px_rgba(0,0,0,0.35)] backdrop-blur sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#30363d] bg-[#0d1117]/80 px-4 py-2 text-sm text-[#c4b5fd]">
            <span className="h-2 w-2 rounded-full bg-[#238636]" />
            {repoName}
          </div>

          <div className="relative mt-8 flex h-24 w-24 items-center justify-center">
            <div className="absolute h-24 w-24 rounded-full border border-[#30363d]" />
            <div className="absolute h-24 w-24 animate-spin rounded-full border-4 border-[#7c3aed]/25 border-t-[#7c3aed]" />
            <div className="grid grid-cols-5 gap-1 rounded-2xl border border-[#30363d] bg-[#0d1117]/80 p-3">
              {Array.from({ length: 20 }).map((_, index) => (
                <span
                  key={index}
                  className={`h-2.5 w-2.5 rounded-sm animate-pulse ${
                    index % 3 === 0
                      ? 'bg-[#7c3aed]'
                      : index % 2 === 0
                        ? 'bg-[#58a6ff]'
                        : 'bg-[#30363d]'
                  }`}
                />
              ))}
            </div>
          </div>

          <h1 className="mt-8 text-2xl font-semibold text-white sm:text-3xl">
            Building your code map
          </h1>
          <p className="mt-3 text-base text-[#8b949e]">
            This usually takes a few moments while CodeNavigator prepares the repository.
          </p>

          <div className="mt-10 w-full rounded-3xl border border-[#30363d] bg-[#0d1117]/75 p-6 text-left">
            <div className="text-xs uppercase tracking-[0.24em] text-[#8b949e]">
              Current step
            </div>
            <div className="mt-3 text-lg font-medium text-[#e6edf3]">
              {steps[currentStepIndex]}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-3 flex items-center justify-between text-sm text-[#8b949e]">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[#0d1117]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#38bdf8] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default IngestionLoader;
