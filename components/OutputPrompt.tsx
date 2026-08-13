'use client';

interface OutputPromptProps {
  response: string;
  setResponse: (val: string) => void;
  loading: boolean;
  copied: boolean;
  handleCopy: () => void;
}

export default function OutputPrompt({
  response,
  setResponse,
  loading,
  copied,
  handleCopy,
}: OutputPromptProps) {
  return (
    <div
      id="output-prompt-section"
      className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="font-mono text-[11px] text-amber-500 tracking-widest uppercase block mb-0.5">
            OUTPUT LAYER
          </span>
          <h2 className="font-serif text-xl text-slate-100 font-normal flex items-center gap-2">
            Master Prompt AI
            {response && (
              <span className="font-mono text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                Editable
              </span>
            )}
          </h2>
        </div>
        {response && (
          <button
            onClick={handleCopy}
            className="font-mono text-xs bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3.5 py-1.5 rounded-lg transition-all"
          >
            {copied ? '✓ Copied' : '📋 Copy Prompt'}
          </button>
        )}
      </div>

      <div className="h-64">
        {loading ? (
          <div className="flex items-center justify-center h-full bg-slate-950/80 border border-slate-800 rounded-xl font-mono text-xs text-slate-500 animate-pulse">
            Synthesizing slide structure...
          </div>
        ) : response ? (
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="w-full h-full bg-slate-950/80 border border-slate-800 p-4 rounded-xl font-mono text-xs leading-relaxed text-slate-300 focus:outline-none focus:border-amber-500/50 resize-none"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-950/80 border border-slate-800 rounded-xl font-mono text-xs text-slate-600">
            Isi kriteria di sebelah kiri lalu klik "Generate Master Prompt".
          </div>
        )}
      </div>
    </div>
  );
}