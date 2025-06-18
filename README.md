# AI Fake Client

AI Fake Client adalah aplikasi web berbasis Node.js dan Express yang memanfaatkan layanan AI (Gemini API) untuk secara otomatis menghasilkan _project brief_ dan simulasi dialog klien palsu. Cocok digunakan untuk latihan komunikasi, simulasi project, atau keperluan edukasi lainnya.

## Fitur

- **Generate Project Brief**: AI akan membuat deskripsi singkat project fiktif berdasarkan nama dan keahlian pengguna.
- **Generate Dialog Client**: AI menghasilkan contoh pesan atau permintaan dari klien palsu terkait project tersebut.
- **Antarmuka Modern**: Tersedia dashboard web responsif dan nyaman digunakan.
- **Fitur Copy Cepat**: Hasil dapat disalin ke clipboard dengan satu klik.

## Cara Kerja

1. Pengguna mengisi nama dan keahlian pada form di dashboard.
2. Sistem mengirim data ke backend (`/api/generate`).
3. Backend memproses data dengan membaca template prompt dari folder `prompts/` lalu meminta respons ke Gemini API.
4. Hasil berupa _project brief_ dan _client message_ dikirim kembali ke frontend dan ditampilkan pada dashboard.

## Struktur Direktori

```
AI-Fake-Client/
├── core.js              # Logika utama pembuatan project & dialog klien palsu
├── server.js            # Server Express, endpoint API & serving static files
├── public/
│   └── index.html       # Dashboard utama (frontend)
├── prompts/
│   ├── fakeProjectPrompt.txt   # Template prompt untuk project
│   └── fakeClientPrompt.txt    # Template prompt untuk dialog klien
├── .env                 # Tempat menyimpan API KEY Gemini (tidak diupload)
└── ...
```

## Penjelasan File Utama

- **server.js**  
  Menangani request dari frontend. Endpoint utama `/api/generate` menerima data user, memanggil fungsi AI, dan mengirim hasil ke frontend.

- **core.js**  
  Berisi fungsi `generateFakeClientData` yang:  
  - Membaca template prompt dari folder `prompts/`
  - Mengirim permintaan ke Gemini API (menggunakan API Key dari `.env`)
  - Mengembalikan hasil simulasi project dan dialog klien palsu

- **public/index.html**  
  Halaman dashboard antarmuka pengguna. Terdapat form input, tombol generate, area hasil, serta tombol copy.

- **prompts/**
  - `fakeProjectPrompt.txt` — Template prompt untuk membangkitkan ide project.
  - `fakeClientPrompt.txt` — Template prompt untuk membangkitkan pesan klien palsu berdasarkan project.

## Prasyarat

- Node.js (disarankan versi 18+)
- NPM
- API Key Gemini (Google Generative Language)

## Instalasi & Menjalankan

1. **Clone repository ini** (wajib login, repo privat):

    ```bash
    git clone https://github.com/FAYnim/AI-Fake-Client.git
    cd AI-Fake-Client
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Buat file `.env`** dan isi:

    ```
    GEMINI_API_KEY=apikey_anda
    ```

4. **Jalankan server**:

    ```bash
    node server.js
    ```

5. **Akses aplikasi** di [http://localhost:3000](http://localhost:3000) melalui browser.

## Catatan Penting

- Jangan bagikan API Key Gemini Anda ke publik.
- File `.env` tidak diupload ke repository (masuk gitignore).
- Template prompt dapat dimodifikasi pada folder `prompts/` sesuai kebutuhan.

## Kredit

Dibuat oleh [Faris AY](https://instagram.com/faris.a.y)  
Inspirasi, desain, dan pengembangan: 2025.

---
