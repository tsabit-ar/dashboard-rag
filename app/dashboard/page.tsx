'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import FormKriteria from '@/components/FormKriteria';
import OutputPrompt from '@/components/OutputPrompt';
import AiToolsList from '@/components/AiToolsList';
import SpecialOffers from '@/components/SpecialOffers';
import HistoryList from '@/components/HistoryList';
import CanvaBonus from '@/components/CanvaBonus';

interface HistoryItem {
  id: string;
  prompt: string;
  response: string;
  created_at: string;
}

export default function DashboardPage() {
  const [topik, setTopik] = useState('');
  const [audiens, setAudiens] = useState('');
  const [slides, setSlides] = useState('10');
  const [status, setStatus] = useState('Belum ada / buatkan dari awal');
  const [detail, setDetail] = useState('');

  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      } else {
        setUserId(session.user.id);
        setCheckingAuth(false);
        fetchHistory(session.user.id);
      }
    };
    checkUser();
  }, [router]);

  const fetchHistory = async (uid: string) => {
    setLoadingHistory(true);
    const { data } = await supabase
      .from('prompt_history')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

    if (data) setHistory(data);
    setLoadingHistory(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleGenerate = async () => {
    const finalPrompt = `Buatkan master prompt presentasi terstruktur dengan kriteria berikut:
- Topik & Tujuan: ${topik}
- Target Audiens: ${audiens}
- Estimasi Jumlah Slide: ${slides} slide
- Status Materi Konten: ${status}${detail.trim() ? `\n- Detail Tambahan: ${detail}` : ''}`;

    setLoading(true);
    setResponse('');
    setCopied(false);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      const data = await res.json();
      if (data.error) {
        setResponse(`Error: ${data.error}`);
      } else {
        setResponse(data.text);
        if (userId) {
          await supabase.from('prompt_history').insert([
            {
              user_id: userId,
              prompt: finalPrompt,
              response: data.text,
            },
          ]);
          fetchHistory(userId);
        }
      }
    } catch {
      setResponse('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    if (!userId) return;
    const { error } = await supabase.from('prompt_history').delete().eq('id', id);
    if (!error) {
      setHistory(history.filter((item) => item.id !== id));
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080d1e] font-mono text-xs text-slate-500">
        Authenticating session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b132b] via-[#080d1e] to-[#04060d] p-6 text-slate-200">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-slate-800 mb-6 backdrop-blur-md">
        <div>
          <span className="font-mono text-[10px] text-amber-500 tracking-widest uppercase block">
            Welcome 
          </span>
          <h1 className="font-serif text-2xl text-slate-100 font-normal">
            PPT Prompt Generator
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="font-mono text-xs bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 px-4 py-2 rounded-lg transition-all"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormKriteria
          topik={topik}
          setTopik={setTopik}
          audiens={audiens}
          setAudiens={setAudiens}
          slides={slides}
          setSlides={setSlides}
          status={status}
          setStatus={setStatus}
          detail={detail}
          setDetail={setDetail}
          onSubmit={handleGenerate}
          loading={loading}
        />

        <div className="space-y-6">
          <OutputPrompt
            response={response}
            setResponse={setResponse}
            loading={loading}
            copied={copied}
            handleCopy={handleCopy}
          />

          {/* Video Tutorial */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
            <span className="font-mono text-[11px] text-amber-500 tracking-widest uppercase block mb-0.5">
              VIDEO TUTORIAL
            </span>
            <h2 className="font-serif text-xl text-slate-100 font-normal mb-3">
              Panduan Pembuatan PPT AI
            </h2>
            <div className="w-full aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Tutorial PPT Prompt Generator"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <AiToolsList />
        </div>
      </div>

      <HistoryList
        history={history}
        loadingHistory={loadingHistory}
        onSelect={(res) => setResponse(res)}
        onDelete={handleDeleteHistory}
      />

      <SpecialOffers />
      
      <CanvaBonus />
    </div>
  );
}