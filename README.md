# 📂 Google Drive Folder Scanner

Aplikasi web ringan dan cepat untuk memindai, mengurutkan, dan mengekstrak struktur hierarki (tree) dari folder dan file di Google Drive. Hasil pindaian dapat dilihat langsung di browser dengan fitur preview, atau diekspor ke dalam format Excel (.xlsx).

**Author:** Abdul Ghofur Iswahyudi  
**Versi:** 1.0  
**Website:** [outsider.my.id](https://outsider.my.id)

---

## ✨ Fitur Utama

- **Otomatis Ekstrak ID:** Cukup *paste* URL/Link Google Drive yang panjang, sistem akan otomatis mengambil ID foldernya.
- **Natural Sorting (A-Z, 0-9):** Pengurutan file dan folder secara logis layaknya manusia (contoh: File 1, File 2, File 10).
- **Export ke Excel:** Unduh hasil struktur direktori beserta link aksesnya ke dalam file Excel dengan rapi menggunakan SheetJS.
- **Preview Dokumen In-App:** Lihat isi file langsung dari dalam aplikasi menggunakan popup modal tanpa harus pindah tab.
- **Salin Tautan Cepat:** Tombol sekali klik untuk menyalin link akses dari masing-masing file/folder.

---

## 🏗️ Dua Pilihan Arsitektur (PENTING)

Repositori ini menyediakan **dua versi implementasi** yang bisa Anda pilih sesuai dengan kebutuhan server dan keamanan Anda:

### 1. Versi Full Google Apps Script (Monolith)
Pada versi ini, **Frontend (HTML/UI)** dan **Backend (Logika Akses Drive)** disatukan dan di-hosting seluruhnya di server Google Apps Script.
- **File yang digunakan:** `Code.gs` (berisi fungsi `doGet` yang me-return `HtmlService`) dan `Index.html` (berisi `google.script.run`).
- **Kelebihan:** Sangat mudah dipasang, tidak butuh layanan hosting eksternal.
- **Kekurangan:** Kecepatan *load* UI bergantung pada server Google, dan tautan web app berupa link `script.google.com` yang sangat panjang.

### 2. Versi SPA / Cloudflare Pages (Decoupled)
Pada versi ini, **Frontend** di-hosting terpisah di layanan seperti Cloudflare Pages, Vercel, atau GitHub Pages. Sedangkan **Backend** di Google Apps Script hanya bertindak sebagai REST API (headless).
- **File yang digunakan:** `Code.gs` (berisi fungsi `doPost` untuk menerima HTTP request) dan `index.html` (menggunakan fungsi standar `fetch()` API).
- **Kelebihan:** UI sangat cepat dan responsif, bisa menggunakan domain khusus (Custom Domain), dan meminimalisir interupsi *CORS*.
- **Kekurangan:** Membutuhkan dua tahap deployment (Backend di GAS, Frontend di Cloudflare).

---

## 🚀 Panduan Instalasi & Deployment

Pilih salah satu metode instalasi di bawah ini:

### Opsi A: Instalasi Versi Full Google Apps Script
1. Buka [Google Apps Script](https://script.google.com/) dan buat project baru.
2. Buat file `Code.gs` dan salin kode dari versi **Full AppScript**. Pastikan file ini memiliki fungsi `doGet(e)` yang me-return *template* HTML.
3. Buat file `Index.html` dan salin kode HTML versi **Full AppScript** (yang menggunakan `google.script.run`).
4. Klik tombol **Deploy** di sudut kanan atas > **New deployment**.
5. Pilih tipe **Web app**.
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
6. Klik **Deploy**. Salin dan gunakan *Web App URL* yang diberikan untuk mengakses aplikasi.

### Opsi B: Instalasi Versi SPA / Cloudflare Pages
**Langkah 1: Setup Backend (API)**
1. Buka [Google Apps Script](https://script.google.com/) dan buat project baru.
2. Buat file `Code.gs` dan salin kode dari versi **SPA/Cloudflare**. Pastikan file ini memiliki fungsi `doPost(e)` untuk mengembalikan data berformat JSON.
3. Lakukan **Deploy** > **New deployment** > tipe **Web app**.
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
4. Klik **Deploy** dan **SIMPAN** *Web App URL* yang dihasilkan.

**Langkah 2: Setup Frontend (UI)**
1. Buka file `index.html` (versi SPA).
2. Cari variabel `API_URL` (berada di bagian `<script>`) dan ganti nilainya dengan *Web App URL* dari langkah 1:
   ```javascript
   const API_URL = "https://script.google.com/macros/s/ID_DEPLOYMENT_ANDA/exec";
   ```
   ATAU LANGSUNG PAKAI
   ```javascript
   const API_URL = "https://script.google.com/macros/s/AKfycby8QF5FJdzGSC7KZzIS4n9Qwzz2TJ0-lo_PUxg2uhzMahFr5WRABjlcUs18Jek8cc7n/exec";
   ```
3. Login ke dashboard [Cloudflare](https://dash.cloudflare.com/).
4. Masuk ke **Workers & Pages** > **Pages** > **Create a project** > **Direct Upload**.
5. Beri nama proyek Anda, lalu unggah file `index.html` tersebut.
6. Selesai! Aplikasi Anda kini dapat diakses melalui domain `.pages.dev` dari Cloudflare.

*(Catatan: Jika Anda melakukan perubahan kode pada backend `Code.gs`, pastikan Anda selalu melakukan deploy menggunakan **New Version**).*
*(Catatan: Jika Anda memakai versi Cloudflare, maka ganti nama `index.html untuk cloudflare atau SPA` dengan nama `index.html`, **atau jika merasa tidak punya waktu,** cukup download dan jalankan langsung di perangkat anda).*

---

## 🛠️ Tech Stack
- **Frontend Framework:** Vanilla JS & HTML5
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (via CDN)
- **Icons:** [Lucide Icons](https://lucide.dev/)
- **Data Export:** [SheetJS (XLSX)](https://sheetjs.com/)
- **Backend & Storage:** [Google Apps Script](https://developers.google.com/apps-script) & Google Drive API

---

## ⚠️ Keamanan & Privasi
- Aplikasi ini berjalan di atas *environment* akun Google Anda sendiri (Execute as Me).
- Frontend (Cloudflare) hanya memanggil data untuk ditampilkan sementara di browser klien.
- Tidak ada database eksternal yang mencatat aktivitas pengguna, tautan, atau nama file yang sedang dipindai.

## 📄 Lisensi
Sistem ini bersifat terbuka. Silakan dikembangkan dan dimodifikasi sesuai kebutuhan Anda. Jika bermanfaat, Anda dapat menautkan kembali ke repositori ini.