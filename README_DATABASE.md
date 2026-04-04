# Database Setup Documentation — Beauty Raha Grand Opening

Dokumen ini menjelaskan setup database TiDB Cloud dengan Drizzle ORM untuk website undangan Grand Opening Beauty Raha.

## 📚 Daftar Isi

1. [Arsitektur](#arsitektur)
2. [Struktur Database](#struktur-database)
3. [API Endpoints](#api-endpoints)
4. [Setup dan Deployment](#setup-dan-deployment)
5. [Environment Variables](#environment-variables)
6. [Cara Penggunaan](#cara-penggunaan)

---

## 🏗 Arsitektur

```
┌─────────────────┐
│  Next.js App    │
│  - /content     │
│  - /admin       │
└────────┬────────┘
         │ Route Handlers
         ▼
┌─────────────────┐
│  Next.js API    │
│  - /api/rsvp/*  │
│  - /api/admin/* │
└────────┬────────┘
         │ Drizzle ORM
         ▼
┌─────────────────┐
│  TiDB Cloud     │
│  (MySQL)        │
│  - rsvp_entries │
└─────────────────┘
```

---

## 📊 Struktur Database

### Tabel: `rsvp_entries`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | `serial` (int, auto-increment) | Primary Key |
| `brand_name` | `varchar(255)` | Nama brand/instansi |
| `guest_count` | `int` | Jumlah tamu yang hadir |
| `guest_names` | `json` | Array nama tamu |
| `created_at` | `timestamp` | Waktu pembuatan |
| `updated_at` | `timestamp` | Waktu terakhir update |

---

## 🌐 API Endpoints

### Public Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check database |
| `/api/rsvp/submit` | POST | Submit konfirmasi kehadiran |

### Admin Endpoints (membutuhkan session admin)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/login` | POST | Login admin dan set cookie session |
| `/api/admin/logout` | POST | Logout admin |
| `/api/admin/session` | GET | Cek status session admin |
| `/api/admin/stats` | GET | Statistik ringkasan |
| `/api/admin/list` | GET | List semua RSVP |
| `/api/admin/export` | GET | Export CSV |

**Auth admin:** login via `POST /api/admin/login`, lalu endpoint admin memakai `httpOnly cookie`.

---

## 🚀 Setup dan Deployment

### 1. Install Dependencies

```bash
cd "/Users/apple/Library/Mobile Documents/com~apple~CloudDocs/Beauty/grand-opening"
npm install
```

### 2. Environment Setup

File `.env` sudah dibuat dengan konfigurasi TiDB Cloud Anda. Pastikan tidak di-commit ke git.

### 3. Database Migration

Untuk membuat tabel di TiDB Cloud:

```bash
# Generate migration files
npm run db:generate

# Push ke database
npm run db:push
```

### 4. Deploy ke Vercel

```bash
# Install Vercel CLI (jika belum)
npm i -g vercel

# Deploy
vercel --prod
```

**Setup Environment Variables di Vercel Dashboard:**

1. Buka project settings di Vercel
2. Tambahkan environment variables:
   - `DATABASE_URL`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`

---

## ⚙️ Environment Variables

| Variable | Description | Contoh |
|----------|-------------|--------|
| `DATABASE_URL` | Connection string TiDB Cloud | `mysql://user:pass@host:port/db` |
| `ADMIN_PASSWORD` | Password untuk halaman admin | `admin123` |
| `ADMIN_SESSION_SECRET` | Secret untuk sign cookie session admin | `random-secret` |
| `NODE_ENV` | Environment mode | `development` / `production` |

---

## 📖 Cara Penggunaan

### Submit RSVP (Tamu)

1. Buka halaman `/content`
2. Isi form konfirmasi kehadiran
3. Klik "Kirim Konfirmasi"
4. Data akan tersimpan di TiDB Cloud

### Akses Admin

1. Buka halaman `/admin`
2. Masukkan password admin Anda
3. Setelah login berhasil, dashboard akan menampilkan:
   - Total brand yang konfirmasi
   - Total tamu yang akan hadir
   - Total responden
   - Tabel daftar tamu lengkap
   - Fitur export CSV

---

## 🔒 Keamanan

1. **Password Protection**: Halaman admin dilindungi password
2. **Session Management**: Session admin disimpan di `httpOnly cookie`
3. **Duplicate Prevention**: `localStorage` flag mencegah submit ganda dari device yang sama
4. **Input Validation**: Zod validation untuk semua input API
5. **Admin Cookie Security**: Session admin memakai `httpOnly cookie` agar tidak bisa diakses JavaScript client

---

## 📝 File Struktur

```
.
├── src/
│   ├── app/
│   │   ├── admin/             # Halaman admin Next.js
│   │   ├── api/               # Route handlers Next.js
│   │   ├── content/           # Halaman undangan
│   │   └── cover/             # Halaman cover alternatif
│   ├── db/
│   │   ├── schema.ts          # Drizzle schema
│   │   └── index.ts           # DB connection
│   ├── lib/
│   │   ├── admin-auth.ts      # Auth cookie admin
│   │   ├── csv.ts             # CSV export helper
│   │   ├── env.ts             # Environment helper
│   │   └── rsvp.ts            # RSVP service logic
│   └── types/
│       └── index.ts           # TypeScript types
├── public/
│   ├── beauty-logo.png        # Logo aktif frontend
│   └── favicon.jpg            # Favicon aktif frontend
├── docs/
│   └── archive/
│       └── batch/             # Arsip referensi desain HTML lama
├── scripts/
│   └── setup-db.ts            # Bootstrap tabel TiDB
├── drizzle.config.ts          # Drizzle configuration
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── .env                       # Environment variables (private)
└── .env.example               # Environment template
```

---

## 🔧 Troubleshooting

### Database Connection Failed

1. Periksa `DATABASE_URL` di `.env`
2. Pastikan IP address Anda di-whitelist di TiDB Cloud
3. Cek health endpoint: `/api/health`

### API Returns 401 Unauthorized

- Password admin salah atau session admin sudah habis
- Login ulang melalui halaman `/admin`

### CSV Export Not Working

- Pastikan browser mengizinkan download
- Cek console untuk error messages

---

## 📞 Support

Jika ada masalah dengan database atau API, periksa:

1. Logs di Vercel Dashboard
2. Health check endpoint
3. Browser console untuk error frontend

---

**Dibuat:** 3 April 2026  
**Versi:** 1.2.0  
**Stack:** Next.js App Router + TiDB Cloud + Drizzle ORM
