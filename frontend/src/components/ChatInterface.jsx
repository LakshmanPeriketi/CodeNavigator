import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Bot } from 'lucide-react';
import useChat from '../hooks/useChat';
import MessageBubble from './MessageBubble';
import Sidebar from './Sidebar';

function ChatInterface({ repoData, onAnalyzeNewRepo }) {
  const [query, setQuery] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const { isLoading, messages, sendMessage } = useChat(repoData.sessionId);

  useEffect(() => {
    if (!textareaRef.current) {
      return;
    }

    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 112)}px`;
  }, [query]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: messages.some((message) => message.isStreaming) ? 'auto' : 'smooth'
    });
  }, [messages]);

  const handleSend = async (nextQuery) => {
    const trimmedQuery = nextQuery.trim();

    if (!trimmedQuery || isLoading) {
      return;
    }

    setQuery('');
    await sendMessage(trimmedQuery);
  };

  const handleTextareaKeyDown = async (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      await handleSend(query);
    }
  };

  const isSendDisabled = !query.trim() || isLoading;

  return (
    <main className="flex min-h-screen flex-col bg-[#0d1117] text-[#e6edf3] lg:flex-row">
      <Sidebar
        onAnalyzeNewRepo={onAnalyzeNewRepo}
        onSelectPrompt={handleSend}
        repoData={repoData}
      />

      <section className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-[#30363d] bg-[#0d1117]/90 px-4 py-4 backdrop-blur sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">
                Repositories / {repoData.name}
              </div>
              <div className="mt-1 text-lg font-semibold text-white">
                {repoData.name}
              </div>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#30363d] bg-[#161b22] px-4 py-2 text-sm text-[#c4b5fd] sm:self-auto">
              <span className="h-2 w-2 rounded-full bg-[#7c3aed]" />
              Gemini 1.5 Pro
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {messages.length === 0 ? (
            <div className="flex h-full min-h-[50vh] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#30363d] bg-[#161b22]/30 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#7c3aed]/15 text-[#c4b5fd]">
                <Bot className="h-8 w-8" />
              </div>
              <h1 className="mt-6 text-2xl font-semibold text-white">
                Ask anything about the codebase
              </h1>
              <p className="mt-3 max-w-lg text-[#8b949e]">
                Explore architecture, trace implementation details, and understand how the
                repository is put together.
              </p>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-[#30363d] bg-[#0d1117]/95 px-4 py-4 backdrop-blur sm:px-6">
          <div className="mx-auto flex w-full max-w-5xl gap-3 rounded-[1.75rem] border border-[#30363d] bg-[#161b22] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.22)]">
            <textarea
              className="max-h-28 min-h-[56px] flex-1 resize-none bg-transparent px-3 py-3 text-base text-[#e6edf3] outline-none placeholder:text-[#8b949e]"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder="Ask about the codebase..."
              ref={textareaRef}
              rows={1}
              value={query}
            />

            <button
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#7c3aed] text-white transition-colors duration-200 hover:bg-[#6d28d9] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSendDisabled}
              onClick={() => handleSend(query)}
              type="button"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ChatInterface;
