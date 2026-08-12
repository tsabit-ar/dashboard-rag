'use client';

import Link from 'next/link';

export default function PanduanGeminiPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header & Back Button */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              📖 Panduan PPT Menggunakan Gemini
            </h1>
            <p className="text-xs text-gray-500">
              Langkah-langkah mengonversi Master Prompt menjadi slide presentasi
            </p>
          </div>
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>

        {/* Content Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-1">
              Kenapa Memilih Gemini?
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Google Gemini mampu menyusun struktur slide, copywriting yang presisi, serta rekomendasi tata letak visual secara mendalam tanpa biaya berlangganan.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-gray-800">
              Langkah-Langkah Eksekusi
            </h2>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
              <span className="font-bold text-xs text-blue-600">Langkah 1: Salin Master Prompt</span>
              <p className="text-xs text-gray-600">
                Gunakan formulir di dashboard aplikasi ini, lalu klik tombol <strong>Salin Master Prompt</strong>.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
              <span className="font-bold text-xs text-blue-600">Langkah 2: Tempel di Google Gemini</span>
              <p className="text-xs text-gray-600">
                Buka situs <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">gemini.google.com</a>, tempelkan teks prompt yang tersalin, lalu kirim permintaan.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
              <span className="font-bold text-xs text-blue-600">Langkah 3: Ekspor ke Google Docs / Slides</span>
              <p className="text-xs text-gray-600">
                Klik ikon <strong>Bagikan & Ekspor</strong> di bagian bawah respon Gemini → pilih <strong>Ekspor ke Dokumen</strong>. Dari Google Docs, Anda dapat mengopi struktur materi secara langsung ke Google Slides atau PowerPoint.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
              <span className="font-bold text-xs text-blue-600">Langkah 4 (Opsional): Otomatisasi VBA / Python</span>
              <p className="text-xs text-gray-600">
                Minta Gemini menghasilkan kode skrip <em>VBA PowerPoint Macro</em> atau modul Python `python-pptx` untuk membuat berkas `.pptx` secara instan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}