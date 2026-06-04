import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import diff from 'react-syntax-highlighter/dist/esm/languages/prism/diff';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import powershell from 'react-syntax-highlighter/dist/esm/languages/prism/powershell';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const supportedLanguages = {
  bash,
  css,
  diff,
  go,
  java,
  javascript,
  js: javascript,
  json,
  jsx,
  markdown,
  md: markdown,
  powershell,
  ps1: powershell,
  python,
  py: python,
  shell: bash,
  sh: bash,
  sql,
  ts: typescript,
  tsx,
  typescript,
  yaml,
  yml: yaml
};

Object.entries(supportedLanguages).forEach(([name, languageDefinition]) => {
  SyntaxHighlighter.registerLanguage(name, languageDefinition);
});

const normalizeLanguage = (language) => {
  const candidate = (language || 'text').toLowerCase();
  return supportedLanguages[candidate] ? candidate : 'text';
};

function CodeBlock({ code, language, filename }) {
  const [copied, setCopied] = useState(false);
  const normalizedLanguage = normalizeLanguage(language);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-[#30363d] bg-[#1e2432]">
      <div className="flex flex-col gap-3 border-b border-[#30363d] bg-black/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <span className="rounded-full border border-[#30363d] bg-[#0d1117]/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8b949e]">
            {normalizedLanguage}
          </span>
          {filename ? (
            <span className="truncate text-sm text-[#c9d1d9]">{filename}</span>
          ) : null}
        </div>

        <button
          className="inline-flex items-center gap-2 self-start rounded-full border border-[#30363d] bg-[#0d1117]/70 px-3 py-1.5 text-xs font-medium text-[#e6edf3] transition-colors duration-200 hover:border-[#7c3aed]/50 hover:text-white"
          onClick={handleCopy}
          type="button"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-[#238636]" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <SyntaxHighlighter
        codeTagProps={{
          style: {
            fontFamily: '"JetBrains Mono", "Fira Code", monospace'
          }
        }}
        customStyle={{
          background: '#1e2432',
          fontSize: '0.9rem',
          margin: 0,
          padding: '1rem'
        }}
        language={normalizedLanguage}
        showLineNumbers={false}
        style={oneDark}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeBlock;
