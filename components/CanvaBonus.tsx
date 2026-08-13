'use client';

export default function CanvaBonus() {
  return (
    <div className="mt-8 bg-gradient-to-r from-amber-500/10 via-slate-900/80 to-slate-900/60 border border-amber-500/30 p-6 rounded-2xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <span className="font-mono text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full uppercase">
          BONUS EXCLUSIVE
        </span>
        <h3 className="font-serif text-xl text-slate-100 font-normal mt-2">
          Template Canva PPT Terkategori
        </h3>
        <p className="font-mono text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">
          Akses folder Google Drive berisi bonus template Canva siap pakai yang telah dikelompokkan berdasarkan kategori gaya desain.
        </p>
      </div>
      <a
        href="https://drive.google.com/drive/folders/1KVgIH8zWY3aYKwM7vxv7UbKd6MqNbJV7?usp=drive_link"
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl transition-all whitespace-nowrap shadow-lg shadow-amber-500/10 self-end sm:self-center"
      >
        Akses Google Drive ↗
      </a>
    </div>
  );
}