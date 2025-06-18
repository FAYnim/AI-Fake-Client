// 1. Import modul menggunakan sintaks ES Module
import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// 2. Mendefinisikan __dirname secara manual untuk ES Module
// Ini adalah pola standar untuk mendapatkan path direktori di ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 3. Inisialisasi aplikasi Express
const app = express();

// 4. Tentukan port untuk server
const PORT = process.env.PORT || 3000;

// 5. Set middleware untuk melayani file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// (Opsional) Rute fallback untuk SPA (Single Page Application)
// Mengarahkan semua permintaan yang tidak cocok kembali ke index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 6. Jalankan server dan listen di port yang telah ditentukan
app.listen(PORT, () => {
  console.log(`Server (ESM) berjalan lancar di http://localhost:${PORT}`);
  console.log('Tekan Ctrl + C untuk menghentikan server.');
});
