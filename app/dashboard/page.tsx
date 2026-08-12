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

interface AiTool {
  id: string;
  name: string;
  description: string;
  badge?: string;
  url: string;
  is_internal: boolean;
  sort_order: number;
}

export default function DashboardPage() {
  // Form State Kriteria
  const [topik, setTopik] = useState('');
  const [audiens, setAudiens] = useState('');
  const [slides, setSlides] = useState('10');
  const [status, setStatus] = useState('Belum ada / buatkan dari awal');
  const [detail, setDetail] = useState('');

  // AI & Response State
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Supabase Data State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [aiTools, setAiTools] = useState<AiTool[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();

  // Proteksi Sesi & Ambil Data
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
      } else {
        setUserId(session.user.id);
        setCheckingAuth(false);
        fetchHistory(session.user.id);
        fetchAiTools();
      }
    };
    checkUser();
  }, [router]);

  // Fetch Riwayat Prompt dari Supabase
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

  // Fetch AI Tools dari Supabase
  const fetchAiTools = async () => {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setAiTools(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleGenerate = async (customQuery?: string) => {
    const finalPrompt = customQuery || `Buatkan master prompt presentasi terstruktur dengan kriteria berikut:
- Topik & Tujuan: ${topik}
- Target Audiens: ${audiens}
- Estimasi Jumlah Slide: ${slides} slide
- Status Materi Konten: ${status}${detail.trim() ? `\n- Detail Tambahan: ${detail}` : ''}`;

    if (!finalPrompt.trim()) return;

    setLoading(true);
    setResponse('');
    setCopied(false);
    setPrompt(finalPrompt);

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom Kiri: Formulir Kriteria Presentasi */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
            ⚙️ Kriteria Presentasi
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerate();
            }}
            className="space-y-4"
          >
            {/* Topik & Tujuan */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Topik & Tujuan Presentasi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={topik}
                onChange={(e) => setTopik(e.target.value)}
                placeholder="Contoh: Strategi Marketing Digital 2026 untuk UMKM"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Target Audiens & Jumlah Slide */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Target Audiens <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={audiens}
                  onChange={(e) => setAudiens(e.target.value)}
                  placeholder="Contoh: Tim C-Level / Mahasiswa"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Estimasi Jumlah Slide <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={slides}
                  onChange={(e) => setSlides(e.target.value)}
                  placeholder="10"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Status Materi Konten */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Status Materi Konten
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Belum ada / buatkan dari awal">Belum ada / buatkan dari awal</option>
                <option value="Sudah ada poin kasar">Sudah ada poin kasar</option>
                <option value="Materi lengkap 100%">Materi lengkap 100%</option>
              </select>
            </div>

            {/* Detail Tambahan */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Detail Tambahan <span className="text-gray-400 font-normal">(Opsional)</span>
              </label>
              <textarea
                rows={3}
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Contoh: Sertakan data statistik, gunakan bahasa semi-formal..."
                className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-black focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? 'Sedang Merancang Master Prompt...' : '✨ Generate Master Prompt'}
            </button>
          </form>
        </div>

        {/* Kolom Kanan: Output AI, Video, & AI Tools */}
        <div className="space-y-6">
          {/* Hasil Rancangan AI (Editable Textarea) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-gray-800 text-base flex items-center gap-2">
                📊 Hasil Master Prompt AI
                {response && (
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-normal">
                    Bisa Diedit
                  </span>
                )}
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

            <div className="h-64">
              {loading ? (
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200 text-gray-400 text-xs animate-pulse">
                  Sedang merancang struktur slide PPT...
                </div>
              ) : response ? (
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Hasil prompt akan muncul di sini..."
                  className="w-full h-full bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs md:text-sm font-sans leading-relaxed text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              ) : (
                <div className="text-gray-400 italic text-xs flex items-center justify-center h-full bg-gray-50 rounded-lg border border-gray-200">
                  Isi kriteria di sebelah kiri lalu klik "Generate Master Prompt".
                </div>
              )}
            </div>
          </div>

          {/* Video Player Tutorial */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
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

          {/* Rekomendasi AI Tools Eksekusi (Dinamis dari Supabase) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
              🤖 Rekomendasi AI Tools Eksekusi
            </h2>
            <div className="space-y-3">
              {aiTools.length === 0 ? (
                <div className="text-xs text-gray-400 italic">Memuat daftar AI Tools...</div>
              ) : (
                aiTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-gray-800">{tool.name}</span>
                        {tool.badge && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{tool.description}</p>
                    </div>
                    <a
                      href={tool.url}
                      target={tool.is_internal ? '_self' : '_blank'}
                      rel={tool.is_internal ? undefined : 'noopener noreferrer'}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium px-3.5 py-1.5 rounded-md transition-colors whitespace-nowrap self-end sm:self-center"
                    >
                      {tool.is_internal ? 'Buka Panduan' : 'Kunjungi Web ↗'}
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Tabel Riwayat Master Prompt */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-800 text-base mb-4 flex items-center gap-2">
          🕒 Riwayat Master Prompt Anda
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