import { lazy, Suspense } from 'react';
import { Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CodeBlock = lazy(() => import('./CodeBlock'));

const getFilenameFromMeta = (meta) => {
  if (!meta) {
    return '';
  }

  const explicitMatch = meta.match(/(?:filename|file)=["']?([^\s"']+)["']?/i);

  if (explicitMatch) {
    return explicitMatch[1];
  }

  return meta.includes('=') ? '' : meta.trim();
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#8b949e]" />
      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#8b949e] [animation-delay:150ms]" />
      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#8b949e] [animation-delay:300ms]" />
    </div>
  );
}

function MessageBubble({ message }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-3xl rounded-[1.75rem] rounded-br-md bg-[#7c3aed] px-5 py-4 text-sm leading-7 text-white shadow-[0_20px_40px_rgba(124,58,237,0.18)]">
          {message.content}
        </div>
      </div>
    );
  }

  const shouldShowTypingIndicator = message.isStreaming && !message.content;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#8b949e]">
        <Bot className="h-4 w-4 text-[#c4b5fd]" />
        CodeNavigator
      </div>

      <div className="w-full rounded-[1.75rem] rounded-tl-md border border-[#30363d] bg-[#161b22] px-5 py-4 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
        {shouldShowTypingIndicator ? (
          <TypingIndicator />
        ) : (
          <div className="text-sm leading-7 text-[#e6edf3]">
            <ReactMarkdown
              components={{
                a: ({ ...props }) => (
                  <a
                    {...props}
                    className="text-[#58a6ff] underline decoration-[#58a6ff]/40 underline-offset-4"
                    rel="noreferrer"
                    target="_blank"
                  />
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-[#7c3aed] pl-4 italic text-[#c9d1d9]">
                    {children}
                  </blockquote>
                ),
                code: ({ className, inline, node, children, ...props }) => {
                  const languageMatch = /language-([\w-]+)/.exec(className || '');
                  const meta = node?.data?.meta || node?.meta || '';
                  const code = String(children).replace(/\n$/, '');

                  if (inline) {
                    return (
                      <code
                        {...props}
                        className="rounded-md bg-[#1e2432] px-1.5 py-1 font-mono text-[0.9em] text-[#c4b5fd]"
                      >
                        {children}
                      </code>
                    );
                  }

                  return (
                    <Suspense
                      fallback={
                        <pre className="my-4 overflow-x-auto rounded-2xl border border-[#30363d] bg-[#1e2432] p-4 font-mono text-sm text-[#e6edf3]">
                          <code>{code}</code>
                        </pre>
                      }
                    >
                      <CodeBlock
                        code={code}
                        filename={getFilenameFromMeta(meta)}
                        language={languageMatch?.[1] || 'text'}
                      />
                    </Suspense>
                  );
                },
                h1: ({ children }) => <h1 className="mt-2 text-2xl font-semibold text-white">{children}</h1>,
                h2: ({ children }) => <h2 className="mt-8 text-xl font-semibold text-white">{children}</h2>,
                h3: ({ children }) => <h3 className="mt-6 text-lg font-semibold text-white">{children}</h3>,
                li: ({ children }) => <li className="ml-5 text-[#e6edf3]">{children}</li>,
                ol: ({ children }) => <ol className="list-decimal space-y-2">{children}</ol>,
                p: ({ children }) => <p className="mb-4 text-[#e6edf3] last:mb-0">{children}</p>,
                pre: ({ children }) => <>{children}</>,
                table: ({ children }) => (
                  <div className="my-4 overflow-x-auto rounded-2xl border border-[#30363d]">
                    <table className="min-w-full border-collapse bg-[#0d1117]/60">{children}</table>
                  </div>
                ),
                td: ({ children }) => (
                  <td className="border-t border-[#30363d] px-4 py-3 text-left text-[#c9d1d9]">{children}</td>
                ),
                th: ({ children }) => (
                  <th className="bg-[#1e2432] px-4 py-3 text-left font-medium text-white">{children}</th>
                ),
                ul: ({ children }) => <ul className="list-disc space-y-2">{children}</ul>
              }}
              remarkPlugins={[remarkGfm]}
            >
              {message.content}
            </ReactMarkdown>

            {message.isStreaming ? (
              <span className="ml-1 inline-block animate-pulse text-[#c4b5fd]">&#9613;</span>
            ) : null}
          </div>
        )}

        {message.sources && message.sources.length > 0 && (
          <div className="mt-4 border-t border-[#30363d] pt-4">
            <details className="group">
              <summary className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-[#8b949e] hover:text-[#c4b5fd]">
                <Bot className="h-4 w-4" />
                View {message.sources.length} Context Sources
              </summary>
              <div className="mt-3 flex flex-col gap-3">
                {message.sources.map((src, i) => (
                  <div key={i} className="rounded-xl border border-[#30363d] bg-[#0d1117] p-3">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#8b949e]">
                      <span className="rounded-lg bg-[#161b22] px-2 py-1 font-mono text-[#58a6ff] border border-[#30363d]">
                        {src.file}
                      </span>
                      <span>Lines {src.lines}</span>
                    </div>
                    <pre className="max-h-40 overflow-y-auto overflow-x-auto whitespace-pre-wrap rounded-lg bg-[#0d1117]/80 p-2 font-mono text-[10px] text-[#e6edf3]/80 scrollbar-thin">
                      {src.snippet}
                    </pre>
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
