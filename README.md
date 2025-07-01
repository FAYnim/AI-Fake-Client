# AI Fake Client

AI Fake Client adalah aplikasi web yang menghasilkan project brief dan simulasi dialog klien palsu secara otomatis menggunakan AI. Aplikasi ini sangat cocok untuk para freelancer, developer, atau desainer yang ingin berlatih berkomunikasi dengan klien, membuat studi kasus untuk portofolio, atau sekadar untuk keperluan edukasi.

---

## Instalasi

Untuk menjalankan aplikasi ini secara lokal, Anda memerlukan web server dengan dukungan PHP.

1.  **Clone Repository**

    ```bash
    git clone https://github.com/FAYnim/AI-Fake-Client.git
    cd AI-Fake-Client
    ```

2.  **Konfigurasi API Key**

    Aplikasi ini membutuhkan API key dari Google AI Studio (Gemini).

    - Buka file `api.php`.
    - Ganti placeholder `MASUKKAN_API_KEY_DISINI` dengan API key Anda.

    ```php
    $apiKey = 'MASUKKAN_API_KEY_DISINI';
    ```

3.  **Jalankan Web Server**

    Anda bisa menggunakan server bawaan PHP untuk pengembangan:

    ```bash
    php -S localhost:8000
    ```

    Aplikasi akan dapat diakses di `http://localhost:8000`.

---

## Tech Stack

-   **Frontend:** HTML, CSS, JavaScript
-   **Backend:** PHP
-   **AI:** Google Gemini API

---

## Struktur File

-   `index.html`: Halaman utama aplikasi.
-   `api.php`: Endpoint untuk berinteraksi dengan Gemini API.
-   `assets/`: Direktori untuk file statis (CSS dan JavaScript).
-   `data/`: Berisi data prompt dan konfigurasi pengguna.
-   `src/`: Kode sumber PHP utama.

---

## Troubleshooting

-   **Hasil tidak muncul:** Pastikan API key yang Anda masukkan di `api.php` sudah benar dan masih aktif.
-   **Error 500:** Periksa log error pada web server Anda. Kemungkinan ada kesalahan pada kode PHP atau konfigurasi server.

---

## Kredit

Dibuat dengan ❤️ oleh **Faris AY**

-   **Instagram:** [@faris.a.y](https://instagram.com/faris.a.y)
-   **Threads:** [@faris.a.y](https://threads.net/@faris.a.y)
