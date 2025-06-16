import fs from 'fs/promises';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY;

async function callGemini(prompt, stage = '') {
  console.log(`⏳ [${stage}] Mengirim permintaan ke Gemini API...`);
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!res.ok) {
    console.error(`❌ [${stage}] Gagal menerima respon. Status: ${res.status}`);
    const errorText = await res.text();
    console.error(errorText);
    process.exit(1);
  }

  const data = await res.json();
  const output = data.candidates?.[0]?.content?.parts?.[0]?.text || '[No Response]';
  console.log(`✅ [${stage}] Respon diterima.\n`);
  return output;
}

async function loadUserProfile(path = './users/default.json') {
  console.log('📂 Membaca profil pengguna...');
  const raw = await fs.readFile(path, 'utf8');
  const profile = JSON.parse(raw);
  return {
    name: profile.name || 'Unknown User',
    bio: profile.bio || '',
    skills: (profile.skills || []).join(', ')
  };
}

async function main() {
  console.log('📌 Mulai proses Prompt Chaining...\n');

  // Load user profile
  const user = await loadUserProfile();
  console.log(`👤 Pengguna: ${user.name}`);
  console.log(`🧠 Bio: ${user.bio}`);
  console.log(`🛠️ Skill: ${user.skills}\n`);

  // Step 1: Generate Fake Project
  console.log('--- LANGKAH 1: Membuat Fake Project ---');
  const rawPrompt = await fs.readFile('./prompts/fakeProjectPrompt.txt', 'utf8');
  const projectPrompt = rawPrompt
    .replace('{{USER_NAME}}', user.name)
    .replace('{{USER_BIO}}', user.bio)
    .replace('{{USER_SKILLS}}', user.skills);

  const projectRaw = await callGemini(projectPrompt, 'Generate Fake Project');
  const titleMatch = projectRaw.match(/Project Title:\s*(.+)/i);
  const descMatch = projectRaw.match(/Project Description:\s*(.+)/i);
  const title = titleMatch?.[1]?.trim() || 'Unknown Title';
  const desc = descMatch?.[1]?.trim() || 'No description found';

  console.log(`📄 Judul Proyek: ${title}`);
  console.log(`📃 Deskripsi: ${desc}\n`);

  // Step 2: Generate Fake Client Message
  console.log('--- LANGKAH 2: Membuat Pesan Klien Palsu ---');
  const clientPromptTemplate = await fs.readFile('./prompts/fakeClientPrompt.txt', 'utf8');
  const finalClientPrompt = clientPromptTemplate
    .replace('{{PROJECT_TITLE}}', title)
    .replace('{{PROJECT_DESC}}', desc);

  const clientMessage = await callGemini(finalClientPrompt, 'Generate Fake Client Message');
  console.log(`📬 Pesan Klien:\n${clientMessage}\n`);

  // Step 3: Simpan ke File Output
  console.log('--- LANGKAH 3: Menyimpan ke File ---');
  const output = `# Fake Project: ${title}\n\n## 🧠 Description:\n${desc}\n\n## 💬 Fake Client Message:\n${clientMessage}`;
  const filename = `output/result_${Date.now()}.md`;
  await fs.writeFile(filename, output);
  console.log(`✅ Selesai! File disimpan di: ${filename}\n`);
}

main().catch(err => {
  console.error('❌ Terjadi error fatal:', err);
});
