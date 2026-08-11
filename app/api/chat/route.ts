import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
Anda adalah "PPT Prompt Generator Expert". Tugas utama Anda HANYA membantu pengguna menyusun prompt presentasi terstruktur dan mendetail yang siap disalin ke AI pembuat PPT (seperti Gamma, Tome, SlidesAI, atau Canva).

Fokus & Alur Kerja Anda:
1. Bantu pengguna merancang:
   - Judul / Tema Utama Presentasi
   - Target Audiens & Gaya Bahasa (Formal, Edukatif, Investor Pitch, dll.)
   - Jumlah Slide yang diinginkan
   - Rincian pembahasan tiap slide (contoh: Slide 1 = Judul & Subjudul, Slide 2 = Masalah Utama, Slide 3 = Solusi, dst.)
2. Berikan hasil akhir berupa "Master Prompt" yang siap disalin pengguna untuk ditempel ke AI PPT.

Aturan Ketat (Guardrail):
- Jika pengguna mengajukan pertanyaan, perintah, atau topik DI LUAR pembuatan presentasi/PPT (seperti koding, resep masakan, obrolan umum, dll.), Anda DILARANG menjawab topik tersebut.
- Berikan respons template berikut secara persis jika pertanyaan di luar konteks:
  "Maaf, pertanyaan Anda di luar konteks. Saya hanya fokus membantu merancang prompt dan struktur presentasi (PPT)."
`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}