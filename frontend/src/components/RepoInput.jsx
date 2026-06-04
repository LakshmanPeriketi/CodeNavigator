import { useState } from 'react';
import { GitBranch } from 'lucide-react';

const githubRepoPattern =
  /^https?:\/\/(?:www\.)?github\.com\/[^/\s]+\/[^/\s?#]+\/?$/i;

function RepoInput({ onSubmit, helperError, hasSubmissionError }) {
  const [githubUrl, setGithubUrl] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeError = validationError || helperError;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!githubRepoPattern.test(githubUrl.trim())) {
      setValidationError('Enter a valid GitHub repository URL.');
      return;
    }

    setValidationError('');
    setIsSubmitting(true);

    try {
      await onSubmit(githubUrl.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasError = Boolean(activeError) || hasSubmissionError;

  return (
    <form className="mx-auto flex w-full max-w-4xl flex-col items-center" onSubmit={handleSubmit}>
      <div
        className={`w-full rounded-[2rem] border bg-[#161b22]/95 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur ${
          hasError ? 'border-[#da3633]/70' : 'border-[#30363d]'
        }`}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            autoComplete="off"
            className="h-14 flex-1 rounded-[1.35rem] border border-transparent bg-transparent px-5 text-base text-[#e6edf3] outline-none placeholder:text-[#8b949e]"
            onChange={(event) => {
              setGithubUrl(event.target.value);
              if (validationError) {
                setValidationError('');
              }
            }}
            placeholder="https://github.com/owner/repository"
            type="url"
            value={githubUrl}
          />

          <button
            className="inline-flex h-14 items-center justify-center gap-2 rounded-[1.35rem] bg-[#7c3aed] px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#6d28d9] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            <GitBranch className="h-4 w-4" />
            {isSubmitting ? 'Indexing...' : 'Ingest Repository'}
          </button>
        </div>
      </div>

      <div className="mt-4 flex w-full flex-col items-start justify-between gap-2 px-2 text-sm sm:flex-row sm:items-center">
        <span className="text-[#8b949e]">Supports public GitHub repositories</span>
        {activeError ? <span className="text-[#da3633]">{activeError}</span> : null}
      </div>
    </form>
  );
}

export default RepoInput;
