
# SPKPPSU Kelurahan

**Sistem Pelaporan Kerja PPSU (Penanganan Prasarana dan Sarana Umum)**

Aplikasi web berbasis **React & Supabase** yang dirancang untuk mendigitalkan proses pelaporan kinerja petugas PPSU di Kelurahan. Aplikasi ini mendukung pelaporan lapangan berbasis lokasi (GPS) dan pemantauan real-time oleh admin.

---

## Fitur Unggulan

### Modul Petugas (Mobile First)
*   ** Absensi & Lokasi Real-time**: Menggunakan **Leaflet Maps** & GPS bawaan HP untuk mendeteksi lokasi kerja secara akurat (Reverse Geocoding: Koordinat -> Nama Jalan).
*   ** Laporan Visual**: Ambil foto langsung dari kamera aplikasi atau upload dari galeri.
*   ** Perbaikan Laporan (Resubmit)**: Fitur "Perbaiki & Kirim Ulang" untuk laporan yang ditolak admin, tanpa perlu mengetik ulang data dari awal.
*   ** Manajemen Profil Mandiri**: Edit foto profil (disimpan sebagai Base64) dan ubah kata sandi dengan aman.
*   ** Riwayat & Filter**: Timeline laporan yang dikelompokkan per tanggal dengan filter status/kategori.

###  Modul Admin (Dashboard)
*   ** Dashboard Analitik Lanjutan**: Statistik kinerja total, grafik batang, dan "Leaderboard" petugas paling rajin dengan tampilan tab-based untuk navigasi antar fungsi.
*   ** Verifikasi Laporan**:
    *   List view responsif (nyaman di Desktop & Mobile).
    *   Filter canggih: Berdasarkan Petugas, Tanggal, dan Status.
    *   Modal Detail: Lihat bukti foto resolusi penuh & peta lokasi.
    *   **Tolak dengan Alasan**: Memberikan feedback spesifik kenapa laporan ditolak.
*   ** Manajemen User**:
    *   CRUD Petugas (Tambah, Edit, Nonaktifkan).
    *   **Hapus Permanen (Hard Delete)**: Menghapus akun beserta seluruh riwayat laporannya dari database (Safety Confirmation).
*   ** Ekspor Data**: Download rekap laporan ke format `.csv` dan `.pdf` untuk arsip kelurahan.
*   ** Statistik & Analitik**: Tampilan visual statistik laporan berdasarkan status dan kategori bawaan, serta kinerja petugas dalam bentuk grafik dan tabel.

---

## Teknologi yang Digunakan

*   **Frontend**: React 18, TypeScript, Vite.
*   **Styling**: Tailwind CSS (Utility-first framework).
*   **Database & Realtime**: Supabase (PostgreSQL).
*   **Peta**: Leaflet.js & OpenStreetMap (Gratis, tanpa API Key Google).
*   **Icons**: Lucide React.
*   **Charts**: Recharts.


---

## Struktur Folder

```text
spkppsu-rawamangun/
├── components/       # Komponen UI Reusable (Layout, Toast, Statistik)
├── context/          # State Management Global (Auth, Data, Notifikasi)
├── Dokumentasi/      # Dokumentasi Teknis, Panduan, dan Laporan Lama
├── Dokumentasi1/     # Dokumentasi Teknis, Panduan, dan Laporan Baru
├── lib/              # Library dan fungsi bantuan (export laporan)
├── pages/            # Halaman Aplikasi
│   ├── admin/        # Dashboard, Kelola Laporan, Kelola User
│   └── petugas/      # Home, Buat Laporan, Riwayat, Profil
├── public/           # Aset statis & konfigurasi redirect Netlify
├── types.ts          # Definisi Tipe TypeScript (Interface User, Report)
├── constants.ts      # Konstanta aplikasi
└── utils/            # Fungsi-fungsi utilitas
```

---

## Akses Aplikasi (Deployment Live)

Aplikasi ini telah dideploy ke platform Vercel dan dapat diakses secara publik:

**(https://spkppsu-kelurahan.vercel.app/)**

---

## Panduan Instalasi & Menjalankan (Lokal)

### 1. Prasyarat
*   Node.js (versi 16+)
*   NPM

### 2. Instalasi Dependensi
```bash
# Clone repository (jika dari git)
git clone https://github.com/Mriskiali/SPKPPSU-Kelurahan.git

# Masuk ke folder
cd spkppsu-kelurahan

# Install library
npm install
```

### 3. Konfigurasi Database (Supabase)

Aplikasi ini membutuhkan database PostgreSQL via Supabase.

1.  Buat project baru di [Supabase.com](https://supabase.com).
2.  Masuk ke **SQL Editor** di dashboard Supabase.
3.  Jalankan script berikut untuk membuat tabel dan akun Admin:

```sql
-- 1. Aktifkan Ekstensi UUID (Wajib)
create extension if not exists "uuid-ossp";

-- 2. Buat Tabel Profile (User)
create table public."Profile" (
  id text primary key default uuid_generate_v4(),
  "pjlpNumber" text unique not null,
  name text not null,
  role text not null default 'PETUGAS',
  "isActive" boolean not null default true,
  phone text,
  "avatarUrl" text,
  password text, 
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null,
  "updatedAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Buat Tabel Report (Laporan)
create table public."Report" (
  id text primary key default uuid_generate_v4(),
  "userId" text not null references public."Profile"(id) on delete cascade,
  "userName" text not null,
  category text not null,
  description text not null,
  "imageUrl" text not null,
  location text not null,
  status text not null default 'PENDING',
  feedback text,
  "createdAt" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Aktifkan Realtime (Agar dashboard update otomatis)
alter publication supabase_realtime add table "Report";
alter publication supabase_realtime add table "Profile";

-- 5. Seeding Akun Admin Pertama
insert into public."Profile" (
  "pjlpNumber", name, role, "isActive", password
) values (
  'admin', 'Super Admin Kelurahan', 'ADMIN', true, 'admin'
);
```

### 4. Setup Environment Variables
Buat file bernama `.env` di root folder proyek, lalu isi dengan kredensial Supabase Anda:

```env
VITE_SUPABASE_URL=https://project-id-anda.supabase.co
VITE_SUPABASE_ANON_KEY=key-anon-public-anda
```

### 5. Jalankan Aplikasi
```bash
npm start
```
Akses di browser: `http://localhost:5173`

---


## Dokumentasi Lengkap

*   [Proposal Penawaran](./Dokumentasi/Proposal_Penawaran.md) - Gambaran umum, metode RPL, dan timeline pengerjaan
*   [Laporan Pendahuluan](./Dokumentasi/Laporan_Pendahuluan.md) - Latar belakang, tujuan, dan ruang lingkup proyek
*   [Laporan Antara](./Dokumentasi/Laporan_Antara.md) - Progres pengembangan hingga tahap tengah
*   [Laporan Akhir](./Dokumentasi/Laporan_Akhir.md) - Hasil akhir proyek dan panduan penggunaan sistem

---

## Deployment

Aplikasi telah berhasil dideploy ke platform Vercel:
*   **Alamat Akses**: [https://spkppsu-kelurahan.vercel.app/]
*   **Build Command**: `npm run build`
*   **Output Directory**: `dist`
*   **Framework**: Terdeteksi otomatis sebagai React/Vite
*   **Environment Variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

Deployment dilakukan secara otomatis ketika ada perubahan di repository, memastikan versi terbaru selalu tersedia untuk pengguna.

## Penutup

SPKPPSU Kelurahan telah berhasil dikembangkan dengan fokus pada kemudahan penggunaan, performa, dan antarmuka yang responsif. Sistem ini menyediakan alat yang efektif bagi petugas lapangan untuk membuat laporan dengan cepat dan akurat, serta memberikan administrator alat untuk mengelola dan meninjau laporan secara efisien.

Fitur-fitur unggulan seperti pemilihan lokasi interaktif seperti di Gojek, sistem notifikasi real-time, antarmuka yang responsif serta optimasi performa membuat sistem ini sangat berguna untuk penggunaan sehari-hari dalam pengelolaan pelayanan umum di Kelurahan.

---

## Lisensi
MIT License. Dibuat untuk Kelurahan.
