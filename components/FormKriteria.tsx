'use client';

interface FormKriteriaProps {
  topik: string;
  setTopik: (val: string) => void;
  audiens: string;
  setAudiens: (val: string) => void;
  slides: string;
  setSlides: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  detail: string;
  setDetail: (val: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function FormKriteria({
  topik,
  setTopik,
  audiens,
  setAudiens,
  slides,
  setSlides,
  status,
  setStatus,
  detail,
  setDetail,
  onSubmit,
  loading,
}: FormKriteriaProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md shadow-2xl">
      <div className="mb-6">
        <span className="font-mono text-[11px] text-amber-500 tracking-widest uppercase block mb-1">
          CONFIGURATOR LAYER
        </span>
        <h2 className="font-serif text-2xl text-slate-100 font-normal">
          Kriteria Presentasi
        </h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4"
      >
        {/* Topik & Tujuan */}
        <div>
          <label className="block font-mono text-xs text-slate-400 mb-1.5">
            Topik & Tujuan Presentasi <span className="text-amber-500">*</span>
          </label>
          <input
            type="text"
            required
            value={topik}
            onChange={(e) => setTopik(e.target.value)}
            placeholder="Contoh: Strategi Marketing Digital 2026"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
          />
        </div>

        {/* Target Audiens & Jumlah Slide */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-mono text-xs text-slate-400 mb-1.5">
              Target Audiens <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              required
              value={audiens}
              onChange={(e) => setAudiens(e.target.value)}
              placeholder="Contoh: Tim C-Level"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-slate-400 mb-1.5">
              Estimasi Slide <span className="text-amber-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="100"
              required
              value={slides}
              onChange={(e) => setSlides(e.target.value)}
              placeholder="10"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
            />
          </div>
        </div>

        {/* Status Materi Konten */}
        <div>
          <label className="block font-mono text-xs text-slate-400 mb-1.5">
            Status Materi Konten
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
          >
            <option value="Belum ada / buatkan dari awal">Belum ada / buatkan dari awal</option>
            <option value="Sudah ada poin kasar">Sudah ada poin kasar</option>
            <option value="Materi lengkap 100%">Materi lengkap 100%</option>
          </select>
        </div>

        {/* Detail Tambahan */}
        <div>
          <label className="block font-mono text-xs text-slate-400 mb-1.5">
            Detail Tambahan <span className="text-slate-600">(Opsional)</span>
          </label>
          <textarea
            rows={3}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Sertakan data statistik, bahasa semi-formal..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-mono text-xs font-bold py-3.5 rounded-lg transition-all uppercase tracking-wider shadow-lg shadow-amber-500/10"
        >
          {loading ? 'Processing System...' : 'Generate Master Prompt'}
        </button>
      </form>
    </div>
  );
}