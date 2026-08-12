'use client';

export default function SpecialOffers() {
  return (
    <div className="mt-8 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
      <span className="font-mono text-[11px] text-amber-500 tracking-widest uppercase block mb-0.5">
        OFFERS
      </span>
      <h3 className="font-serif text-xl text-slate-100 font-normal mb-4">
        Penawaran Spesial & Layanan Tambahan
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Offer 1 */}
        <div className="p-4 bg-gradient-to-b from-amber-500/10 to-slate-950 border border-amber-500/30 rounded-xl flex flex-col justify-between">
          <div>
            <span className="font-mono text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full uppercase">
              REKOMENDASI
            </span>
            <h4 className="font-serif text-lg text-slate-100 mt-2">
              Akses Premium All-in-One
            </h4>
            <p className="font-mono text-xs text-slate-400 mt-1 leading-relaxed">
              Akses AI dan Tools banyak lainnya + Streaming Beberapa Platform.
            </p>
          </div>
          <a
            href="https://lynk.id/noahproject1/veoe8k297pnm"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-center font-mono text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-lg transition-all"
          >
            Lihat Penawaran ↗
          </a>
        </div>

        {/* Offer 2 */}
        <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl flex flex-col justify-between opacity-60">
          <div>
            <span className="font-mono text-[10px] bg-slate-800 text-slate-400 font-semibold px-2 py-0.5 rounded-full uppercase">
              UPCOMING
            </span>
            <h4 className="font-serif text-lg text-slate-400 mt-2">
              Segera Hadir
            </h4>
            <p className="font-mono text-xs text-slate-600 mt-1 leading-relaxed">
              Layanan eksklusif tambahan sedang disiapkan untuk Anda.
            </p>
          </div>
          <button
            disabled
            className="mt-4 font-mono text-xs bg-slate-900 text-slate-600 py-2 rounded-lg cursor-not-allowed border border-slate-800"
          >
            Coming Soon
          </button>
        </div>

        {/* Offer 3 */}
        <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl flex flex-col justify-between opacity-60">
          <div>
            <span className="font-mono text-[10px] bg-slate-800 text-slate-400 font-semibold px-2 py-0.5 rounded-full uppercase">
              UPCOMING
            </span>
            <h4 className="font-serif text-lg text-slate-400 mt-2">
              Segera Hadir
            </h4>
            <p className="font-mono text-xs text-slate-600 mt-1 leading-relaxed">
              Layanan eksklusif tambahan sedang disiapkan untuk Anda.
            </p>
          </div>
          <button
            disabled
            className="mt-4 font-mono text-xs bg-slate-900 text-slate-600 py-2 rounded-lg cursor-not-allowed border border-slate-800"
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
}