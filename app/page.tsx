'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b132b] via-[#080d1e] to-[#04060d] flex items-center justify-center p-6 text-slate-200">
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 p-8 rounded-2xl backdrop-blur-md shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <span className="font-mono text-[10px] text-amber-500 tracking-widest uppercase block mb-1">
            SELAMAT DATANG
          </span>
          <h1 className="font-serif text-3xl text-slate-100 font-normal">
            PPT PromptGenerator
          </h1>
          <p className="font-mono text-xs text-slate-400 mt-2">
            Akses dashboard pembuatan ppt prompt
          </p>
        </div>

        {/* Error / Alert Message */}
        {errorMsg && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center font-mono text-xs text-amber-400">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block font-mono text-xs text-slate-400 mb-1.5">
              Alamat Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-slate-400 mb-1.5">
              Kata Sandi
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-mono text-xs font-bold py-3.5 rounded-lg transition-all uppercase tracking-wider shadow-lg shadow-amber-500/10 mt-2"
          >
            {loading ? 'Authenticating...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}