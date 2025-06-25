// server.js (Sudah diintegrasikan)

import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateFakeClientData } from './core.js'; // <-- Import fungsi dari core.js

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware untuk membaca JSON dan melayani file statis
app.use(express.json()); // <-- PENTING untuk membaca req.body
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint untuk men-generate data
app.post('/api/generate', async (req, res) => {
  try {
    // Ambil data dari body request yang dikirim frontend
    const { nama, bio, keahlian, preferensi } = req.body;

    if (!nama || !bio || !keahlian || !preferensi) {
      return res.status(400).json({ error: 'Semua data harus diisi.' });
    }

    // Panggil fungsi utama dari core.js dan tunggu hasilnya
    const result = await generateFakeClientData({ name: nama, bio: bio, skills: keahlian, preference: preferensi});

    // Kirim hasil kembali ke frontend sebagai JSON
    res.json(result);

  } catch (error) {
    console.error('Error di endpoint /api/generate:', error);
    res.status(500).json({ error: 'Terjadi kesalahan di server saat memproses permintaan.' });
  }
});

// Rute fallback untuk mengarahkan semua permintaan GET lain ke index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server (ESM) berjalan lancar di http://localhost:${PORT}`);
  console.log('Tekan Ctrl + C untuk menghentikan server.');
});
