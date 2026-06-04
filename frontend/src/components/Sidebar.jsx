import { Github, Plus, Rocket } from 'lucide-react';

const suggestedQuestions = [
  'Explain the overall architecture',
  'How is authentication handled?',
  'Where is the database connection?',
  'What are the main API endpoints?',
  'Explain the folder structure'
];

function Sidebar({ repoData, onSelectPrompt, onAnalyzeNewRepo }) {
  return (
    <aside className="w-full border-b border-[#30363d] bg-[#161b22]/95 lg:flex lg:w-[260px] lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col px-4 py-5 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#7c3aed]/15 p-2.5 text-[#c4b5fd]">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">CodeNavigator</div>
            <div className="text-xs text-[#8b949e]">Repository intelligence</div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-[#30363d] bg-[#0d1117]/70 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-white">{repoData.name}</div>
              <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-[#238636]/15 px-2.5 py-1 text-xs font-medium text-[#7ee787]">
                <span className="h-2 w-2 rounded-full bg-[#238636]" />
                Indexed
              </div>
            </div>

            {repoData.url ? (
              <a
                className="rounded-full border border-[#30363d] p-2 text-[#8b949e] transition-colors duration-200 hover:border-[#7c3aed]/50 hover:text-white"
                href={repoData.url}
                rel="noreferrer"
                target="_blank"
              >
                <Github className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-6">
          <div className="text-xs uppercase tracking-[0.22em] text-[#8b949e]">
            Suggested Questions
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {suggestedQuestions.map((question) => (
              <button
                key={question}
                className="rounded-2xl border border-[#30363d] bg-[#0d1117]/60 px-4 py-3 text-left text-sm text-[#c9d1d9] transition-colors duration-200 hover:border-[#7c3aed]/50 hover:text-white"
                onClick={() => onSelectPrompt(question)}
                type="button"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <button
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl border border-[#30363d] bg-transparent px-4 py-3 text-sm font-medium text-[#e6edf3] transition-colors duration-200 hover:border-[#7c3aed]/50 hover:bg-[#7c3aed]/10 lg:mt-auto"
          onClick={onAnalyzeNewRepo}
          type="button"
        >
          <Plus className="h-4 w-4" />
          Analyze New Repo
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
