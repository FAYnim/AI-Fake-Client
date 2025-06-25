// core.js (Sudah dimodifikasi menjadi modul)

import fs from 'fs/promises';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY;

// Fungsi ini akan dipanggil oleh server.js
export async function generateFakeClientData(userData) {
  console.log('📌 Memulai proses AI Fake Client...');
  const { name, bio, skills, preference } = userData;

  // --- LANGKAH 1: Membuat Fake Project ---
  console.log('--- Step 1: Generating Fake Project ---');
  const rawPrompt = await fs.readFile('./prompts/fakeProjectPrompt.txt', 'utf8');
  const projectPrompt = rawPrompt
    .replace('{{USER_NAME}}', name)
    .replace('{{USER_BIO}}', bio)
    .replace('{{USER_SKILLS}}', skills)
    .replace('{{USER_PREFERENCE}}', preference);
  console.log({projectPrompt});

  const projectRaw = await callGemini(projectPrompt, 'Generate Fake Project');
  const titleMatch = projectRaw.match(/Project Title:\s*(.+)/i);
  const descMatch = projectRaw.match(/Project Description:\s*(.+)/s); // 's' flag for multiline
  const title = titleMatch?.[1]?.trim() || 'Unknown Project Title';
  const desc = descMatch?.[1]?.trim() || 'No description provided.';
  
  const projectBrief = `Project Title: ${title}\n\nProject Description:\n${desc}`;
  console.log(`📄 Project Brief Generated.`);

  // --- LANGKAH 2: Membuat Pesan Klien Palsu ---
  console.log('--- Step 2: Generating Fake Client Message ---');
  const clientPromptTemplate = await fs.readFile('./prompts/fakeClientPrompt.txt', 'utf8');
  const finalClientPrompt = clientPromptTemplate
    .replace('{{PROJECT_TITLE}}', title)
    .replace('{{PROJECT_DESC}}', desc);

  const clientMessage = await callGemini(finalClientPrompt, 'Generate Fake Client Message');
  console.log(`📬 Client Message Generated.`);

  console.log('✅ Proses Selesai!');
  
  // Kembalikan hasilnya, bukan menyimpannya ke file
  return { projectBrief, clientMessage };
}

// Helper function untuk memanggil Gemini API
async function callGemini(prompt, stage = '') {
  console.log(`⏳ [${stage}] Mengirim permintaan ke Gemini API...`);
  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        // Konfigurasi tambahan untuk hasil yang lebih baik
        generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
        }
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ [${stage}] Gagal menerima respon. Status: ${res.status}`);
      console.error(errorText);
      // Lemparkan error agar bisa ditangkap oleh server.js
      throw new Error(`Gemini API error (Status: ${res.status}): ${errorText}`);
    }

    const data = await res.json();
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text || '[No Response from AI]';
    console.log(`✅ [${stage}] Respon diterima.`);
    return output;
  } catch (error) {
     console.error(`❌ [${stage}] Error saat fetch ke Gemini:`, error);
     throw error; // Lemparkan lagi agar bisa ditangkap di level atas
  }
}
