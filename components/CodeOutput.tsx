import React from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface CodeOutputProps {
  html: string;
}

const CodeOutput = ({ html }: CodeOutputProps) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(html).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [html]);

  return (
    <div className="relative">
      <p className="text-sm text-slate-600 mb-2">Copy this code and paste it into a "Media/Widget" asset in LibGuides.</p>
      <textarea
        readOnly
        value={html}
        className="w-full h-96 bg-gray-900 border border-slate-700 rounded-md p-4 font-mono text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-accent"
        aria-label="Generated HTML code"
      />
      <button
        onClick={handleCopy}
        className="absolute top-10 right-3 px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md transition-all duration-200 flex items-center"
        aria-live="polite"
      >
        {copied ? (
          <>
            <CheckIcon className="w-4 h-4 mr-1 text-green-400" /> Copied!
          </>
        ) : (
          <>
            <CopyIcon className="w-4 h-4 mr-1" /> Copy Code
          </>
        )}
      </button>
    </div>
  );
};

export default CodeOutput;
