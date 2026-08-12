'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AiTool {
  id: string;
  name: string;
  description: string;
  badge?: string;
  url: string;
  is_internal: boolean;
  sort_order: number;
}

export default function AiToolsList() {
  const [aiTools, setAiTools] = useState<AiTool[]>([]);

  useEffect(() => {
    const fetchAiTools = async () => {
      const { data } = await supabase
        .from('ai_tools')
        .select('*')
        .order('sort_order', { ascending: true });
      if (data) setAiTools(data);
    };
    fetchAiTools();
  }, []);

  return (
    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
      <span className="font-mono text-[11px] text-amber-500 tracking-widest uppercase block mb-0.5">
        EXECUTION ENGINES
      </span>
      <h2 className="font-serif text-xl text-slate-100 font-normal mb-4">
        Rekomendasi AI Tools
      </h2>

      <div className="space-y-3">
        {aiTools.length === 0 ? (
          <div className="font-mono text-xs text-slate-600">Loading engines...</div>
        ) : (
          aiTools.map((tool) => (
            <div
              key={tool.id}
              className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-xs text-slate-200">
                    {tool.name}
                  </span>
                  {tool.badge && (
                    <span className="font-mono text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="font-mono text-xs text-slate-400 leading-relaxed">
                  {tool.description}
                </p>
              </div>
              <a
                href={tool.url}
                target={tool.is_internal ? '_self' : '_blank'}
                rel={tool.is_internal ? undefined : 'noopener noreferrer'}
                className="font-mono text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap self-end sm:self-center"
              >
                {tool.is_internal ? 'Buka Panduan' : 'Kunjungi Web ↗'}
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}