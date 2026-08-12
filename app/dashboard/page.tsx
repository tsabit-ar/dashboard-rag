'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface HistoryItem {
  id: string;
  prompt: string;
  response: string;
  created_at: string;
}

export default function DashboardPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // State untuk Riwayat Prompt
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();

  // Proteksi Sesi & Ambil User ID
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

  // Fungsi Ambil Riwayat dari Supabase
  const fetchHistory = async (uid: string) => {
    setLoadingHistory(true);
    const { data, error } = await supabase
      .from('prompt_history')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setHistory(data);
    }
    setLoadingHistory(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleGenerate = async (inputQuery?: string) => {
    const query = inputQuery || prompt;
    if (!query.trim()) return;

    setLoading(true);
    setResponse('');
    setCopied(false);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });

      const data = await res.json();
      if (data.error) {
        setResponse(`Error: ${data.error}`);
      } else {
        setResponse(data.text);
        
        // Simpan ke Supabase jika ada User ID
        if (userId) {
          await supabase.from('prompt_history').insert([
            {
              user_id: userId,
              prompt: query,
              response: data.text,
            },
          ]);
          // Refresh daftar riwayat
          fetchHistory(userId);
        }
      }
    } catch (err) {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 text-sm">
        Memeriksa hak akses...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-800">PPT Generator Hub</h1>
          <p className="text-xs text-gray-500">Rancang Master Prompt Presentasi Siap Pakai</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Area Video Player */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between border border-gray-200 min-h-[420px]">
          <div>
            <h2 className="font-bold text-gray-800 text-base mb-3">
              🎬 Panduan & Tutorial PPT AI
            </h2>
            <div className="w-full aspect-video rounded-lg overflow-hidden border border-gray-200 bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                title="Tutorial PPT Prompt Generator"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            *Tonton video panduan di atas untuk mempelajari teknik *prompt engineering* pembuatan slide presentasi secara efektif.
          </p>
        </div>

        {/* Area PPT Prompt Generator UI */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between border border-gray-200 min-h-[420px]">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-gray-800 text-base">
                📊 PPT Prompt Generator AI
              </h2>
              {response && (
                <button
                  onClick={handleCopy}
                  className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md transition-colors font-medium flex items-center gap-1"
                >
                  {copied ? '✓ Tersalin!' : '📋 Salin Master Prompt'}
                </button>
              )}
            </div>

            {/* Output Response */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-64 overflow-y-auto text-sm mb-4">
              {loading ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-xs animate-pulse">
                  Sedang merancang struktur slide PPT...
                </div>
              ) : response ? (
                <p className="whitespace-pre-wrap font-sans leading-relaxed text-gray-800 text-xs md:text-sm">
                  {response}
                </p>
              ) : (
                <div className="text-gray-400 italic text-xs space-y-2">
                  <p>Masukkan topik, jumlah slide, atau audiens presentasi Anda.</p>
                  <p className="font-semibold text-gray-500">Contoh permintaan:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>"Buatkan prompt presentasi 5 slide tentang Pitch Deck Startup."</li>
                    <li>"Materi perkuliahan 7 slide topik Pemrograman Web."</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Form Input & Quick Preset */}
          <div className="space-y-3">
            <div className="flex gap-2 text-xs overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => {
                  const text = "Buatkan prompt presentasi 5 slide untuk Pitch Deck Investor Startup.";
                  setPrompt(text);
                  handleGenerate(text);
                }}
                className="bg-gray-100 hover:bg-gray-200 border text-gray-700 px-2.5 py-1 rounded-md whitespace-nowrap transition-colors"
              >
                💡 Pitch Deck (5 Slide)
              </button>
              <button
                type="button"
                onClick={() => {
                  const text = "Buatkan prompt presentasi 7 slide untuk Materi Edukasi Perkuliahan.";
                  setPrompt(text);
                  handleGenerate(text);
                }}
                className="bg-gray-100 hover:bg-gray-200 border text-gray-700 px-2.5 py-1 rounded-md whitespace-nowrap transition-colors"
              >
                📚 Edukasi (7 Slide)
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerate();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Contoh: Presentasi 6 slide tentang Strategi Marketing..."
                className="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
              >
                {loading ? '...' : 'Rancang'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bagian Riwayat Prompt */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
          🕒 Riwayat Prompt Anda
        </h3>

        {loadingHistory ? (
          <div className="text-xs text-gray-400 animate-pulse">Memuat riwayat...</div>
        ) : history.length === 0 ? (
          <div className="text-xs text-gray-400 italic">Belum ada riwayat prompt yang tersimpan.</div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-semibold text-gray-800 truncate mb-1">
                    "{item.prompt}"
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {new Date(item.created_at).toLocaleString('id-ID', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <button
                    onClick={() => {
                      setPrompt(item.prompt);
                      setResponse(item.response);
                    }}
                    className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-md font-medium transition-colors"
                  >
                    Buka Hasil
                  </button>
                  <button
                    onClick={() => handleDeleteHistory(item.id)}
                    className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1.5 rounded-md font-medium transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
