'use client';

interface HistoryItem {
  id: string;
  prompt: string;
  response: string;
  created_at: string;
}

interface HistoryListProps {
  history: HistoryItem[];
  loadingHistory: boolean;
  onSelect: (response: string) => void;
  onDelete: (id: string) => void;
}

export default function HistoryList({
  history,
  loadingHistory,
  onSelect,
  onDelete,
}: HistoryListProps) {
  return (
    <div className="mt-8 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
      <span className="font-mono text-[11px] text-amber-500 tracking-widest uppercase block mb-0.5">
        SYSTEM LOGS
      </span>
      <h3 className="font-serif text-xl text-slate-100 font-normal mb-4">
        Riwayat Master Prompt
      </h3>

      {loadingHistory ? (
        <div className="font-mono text-xs text-slate-600 animate-pulse">
          Retrieving logs...
        </div>
      ) : history.length === 0 ? (
        <div className="font-mono text-xs text-slate-600 italic">
          Belum ada riwayat prompt tersimpan.
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:border-slate-700 transition-all"
            >
              <div className="flex-1 overflow-hidden">
                <p className="font-mono text-xs text-slate-300 truncate mb-1">
                  "{item.prompt}"
                </p>
                <p className="font-mono text-[10px] text-slate-500">
                  {new Date(item.created_at).toLocaleString('id-ID', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => onSelect(item.response)}
                  className="font-mono text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-all"
                >
                  Buka Hasil
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="font-mono text-xs bg-red-950/40 hover:bg-red-900/60 text-red-400 px-2.5 py-1.5 rounded-lg border border-red-900/50 transition-all"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}