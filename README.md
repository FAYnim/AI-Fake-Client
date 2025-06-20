# AI Fake Client

AI Fake Client adalah aplikasi web berbasis Node.js dan Express yang menggunakan Gemini API untuk membuat project brief dan simulasi dialog klien palsu secara otomatis. Aplikasi ini cocok untuk latihan komunikasi, simulasi project, keperluan edukasi, maupun testing portofolio.

---

## Cara Instalasi & Menjalankan

Ikuti langkah-langkah di bawah ini untuk menginstall dan menjalankan AI Fake Client di komputer Anda.

### 1. Clone Repository

Clone repository ini ke komputer Anda (pastikan sudah login GitHub dan punya akses ke repo privat):

```bash
git clone https://github.com/FAYnim/AI-Fake-Client.git
cd AI-Fake-Client
```

### 2. Install Dependency Package

Pastikan Node.js (recommended v18 ke atas) sudah terpasang.  
Install seluruh package yang dibutuhkan dengan perintah:

```bash
npm install
```

### 3. Konfigurasi API Key Gemini

Buat file `.env` pada root folder, lalu isi seperti berikut (ganti dengan API Key milik Anda):

```
GEMINI_API_KEY=masukkan_api_key_gemini_anda
```

> **Catatan:**  
> - File `.env` ini jangan dishare ke publik.
> - Anda bisa mendapatkan API Key Gemini dari konsol Google AI Studio.

### 4. Jalankan Server

Untuk menjalankan server, gunakan:

```bash
node server.js
```

Secara default, server akan berjalan di `http://localhost:3000`.

### 5. Akses Dashboard

Buka browser, lalu akses:

```
http://localhost:3000
```

Isi nama dan keahlian Anda, lalu klik **Generate** untuk mendapatkan hasil project brief dan contoh dialog klien palsu.

---

## Struktur File Penting

- `server.js` — Server Express, endpoint API dan serving static files.
- `core.js` — Logika utama generate project & client message (memanggil Gemini API).
- `public/index.html` — Dashboard frontend (form input, hasil, tombol copy).
- `prompts/fakeProjectPrompt.txt` — Template prompt untuk ide project.
- `prompts/fakeClientPrompt.txt` — Template prompt untuk dialog klien.

---

## Troubleshooting

- **Error "GEMINI_API_KEY not found"**  
  ⇒ Pastikan file `.env` sudah dibuat dan berisi API Key yang benar.

- **Tidak dapat mengakses `localhost:3000`**  
  ⇒ Pastikan server sudah dijalankan dan tidak ada error di terminal.

- **Result kosong atau error**  
  ⇒ Cek koneksi internet, pastikan API Key Gemini masih aktif dan valid.

---

## Kredit

Dibuat oleh [Faris AY](https://instagram.com/faris.a.y)  
2025
