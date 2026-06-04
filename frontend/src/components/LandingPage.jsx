import { Code2, MessageSquare, Rocket, Zap } from 'lucide-react';
import RepoInput from './RepoInput';

const features = [
  {
    title: 'Understands Code Structure',
    description: 'Trace architecture, entrypoints, and implementation details across the repository.',
    icon: Code2
  },
  {
    title: 'Natural Language Queries',
    description: 'Ask questions the way you think, without hunting through files by hand.',
    icon: MessageSquare
  },
  {
    title: 'Instant Answers with Context',
    description: 'Get grounded responses that stay anchored to the codebase you indexed.',
    icon: Zap
  }
];

function LandingPage({ onSubmit, ingestionStatus, errorMessage }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0d1117] text-[#e6edf3]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.2),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_28%)]" />

      <header className="absolute left-6 top-6 z-10 flex items-center gap-3 rounded-full border border-[#30363d] bg-[#161b22]/80 px-4 py-2 backdrop-blur">
        <div className="rounded-full bg-[#7c3aed]/20 p-2 text-[#c4b5fd]">
          <Rocket className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold tracking-wide text-white sm:text-base">
          CodeNavigator
        </span>
      </header>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 py-24">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#30363d] bg-[#161b22]/70 px-4 py-2 text-sm text-[#8b949e] shadow-glow backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#238636]" />
            AI-powered GitHub repository chat
          </div>

          <h1 className="max-w-4xl text-balance text-4xl font-extrabold leading-tight tracking-tight text-transparent sm:text-5xl lg:text-7xl">
            <span className="bg-gradient-to-r from-[#a78bfa] via-[#7c3aed] to-[#38bdf8] bg-clip-text">
              Chat with any GitHub Repository
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#8b949e] sm:text-xl">
            Paste a repo URL and start asking questions about the codebase instantly.
          </p>

          <div className="mt-10 w-full">
            <RepoInput
              hasSubmissionError={ingestionStatus === 'error'}
              helperError={errorMessage}
              onSubmit={onSubmit}
            />
          </div>
        </div>

        <div className="mx-auto mt-14 grid w-full max-w-6xl gap-4 md:grid-cols-3">
          {features.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="group rounded-3xl border border-[#30363d] bg-[#161b22]/85 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur transition-colors duration-200 hover:border-[#7c3aed]/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7c3aed]/15 text-[#c4b5fd] transition-colors duration-200 group-hover:bg-[#7c3aed]/20">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-[#e6edf3]">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#8b949e]">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
