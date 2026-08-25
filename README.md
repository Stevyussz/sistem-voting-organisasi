# E-Voting Ketua & Wakil Ketua MPK MAN 3 Jember

Website resmi pemilihan Ketua dan Wakil Ketua MPK MAN 3 Jember periode 2026/2027. Dibuat dengan HTML, CSS, dan JavaScript murni agar sangat ringan dan nyaman digunakan dari ponsel siswa.

## Fitur Utama

- **Realtime Demo Mode:** Menggunakan `localStorage` sebagai pengganti database untuk testing awal. Sangat mudah diubah menjadi Firestore (tersedia setup config-nya).
- **Sistem keamanan NISN:** Setiap NISN yang didaftarkan panitia hanya dapat digunakan untuk satu suara.
- **Responsive Mobile First:** Nyaman dibuka dari HP para anggota.
- **Modern UI/UX:** Tampilan formal terang bernuansa ivory, navy, dan emas; kartu pasangan calon, animasi halus, serta responsif untuk layar ponsel.
- **Live Results:** Chart animasi bar untuk memantau perolehan suara.
- **Admin Panel:** Untuk mendaftarkan NISN pemilih, mengekspor statusnya, serta membuka/menutup sesi voting.

## Struktur File

- `index.html` - Halaman verifikasi NISN pemilih.
- `vote.html` - Antarmuka utama untuk memilih kandidat.
- `results.html` - Halaman hasil perhitungan suara (Realtime Live Result).
- `admin.html` - Panel administrator.
- `css/styles.css` - Global stylesheet (Design System).
- `js/app.js` - Data kandidat dan fungsi bantuan (termasuk mock DB di local storage).
- `js/firebase-config.js` - Konfigurasi Firestore untuk mode production.

## Cara Penggunaan (Demo Mode)

Aplikasi ini sudah siap pakai di lokal! Tidak butuh setup database rumit jika hanya untuk demo/testing.

1. Buka `index.html?demo=1` di browser (bisa menggunakan VS Code Live Server). Parameter tersebut menjalankan data demo hanya pada browsermu, tanpa mengubah Firebase produksi.
2. Gunakan NISN contoh dari `0090000001` hingga `0090000030`.
3. Setelah masuk, coba pilih kandidat dan submit.
4. Anda akan otomatis dialihkan ke halaman **Live Result**.
5. Untuk membuka Panel Admin:
   - Pergi ke `admin.html`.
   - Masukkan password: `pm26admin2026`.
   - Anda dapat menambahkan NISN siswa, melihat NISN yang belum terpakai, dan mengekspor statusnya sebagai CSV.
   - Anda bisa membuka/menutup akses voting.

## Reset Data Voting

Masuk ke `admin.html`, lalu di bagian **Reset database voting** ketik persis `RESET MPK 2026` dan konfirmasikan tindakan tersebut. Reset menghapus data aplikasi MPK pada koleksi `tokens`, `candidates`, `aspirasi`, dan `settings`; kandidat akan dibuat kembali dengan perolehan 0 suara, sementara voting berada dalam status tertutup.

> Reset tidak dapat dibatalkan. Ekspor rekap NISN terlebih dahulu bila data masih diperlukan.

## Persiapan Deploy ke Vercel (Production)

Karena ini menggunakan HTML/CSS/JS murni (Vanilla), Anda hanya perlu menghubungkan repository project ini ke Vercel:

1. Upload folder ini ke GitHub repository Anda.
2. Login ke [Vercel](https://vercel.com/) dan buat `New Project`.
3. Import dari repository GitHub tadi.
4. Klik **Deploy** tanpa perlu build step apapun.

## (Opsi) Beralih ke Firebase Firestore

Untuk menjalankan aplikasi dengan database Cloud, buka aplikasi tanpa parameter `?demo=1`. Mode demo hanya aktif saat URL menggunakan parameter tersebut. Jika ingin menggunakan database Cloud agar data terpusat saat online:

1. Buat project di [Firebase Console](https://console.firebase.google.com/).
2. Aktifkan **Cloud Firestore** dan set Rules agar aman (Bisa read/write via anonymous auth atau sesuaikan kebutuhan).
3. Copy config Firebase Anda.
4. Buka `js/firebase-config.js`.
5. Pastikan URL yang dibuka tidak memakai `?demo=1`.
6. Paste konfigurasi Firebase Anda ke dalam objek `firebaseConfig`.

> Catatan: Jika menggunakan Firebase, pastikan untuk menyesuaikan logic _read/write_ di `app.js` dan halaman lainnya agar mengambil data dari `db.collection()` bukan `Store.get()`/`Store.set()`.
