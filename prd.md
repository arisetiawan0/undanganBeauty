# Product Requirements Document (PRD)
## Website Undangan Digital — Grand Opening Beauty Raha

---

| Atribut | Detail |
|---|---|
| **Nama Produk** | Website Undangan Digital Grand Opening Beauty Raha |
| **Tipe Produk** | Mobile-First Web App — Landing Page + Admin Guest List |
| **Versi** | 1.2.0 |
| **Dibuat oleh** | Tim Produk |
| **Terakhir diperbarui** | 2 April 2026 |
| **Status** | In Progress — Tanggal & Lokasi Terkonfirmasi ✅ |

---

## 1. Latar Belakang & Tujuan

### 1.1 Latar Belakang

Beauty Raha akan mengadakan acara Grand Opening yang perlu dikomunikasikan secara digital kepada calon tamu undangan. Alih-alih menggunakan undangan fisik atau pesan teks biasa, dibutuhkan sebuah **website undangan digital** yang elegan, modern, dan mampu memberikan kesan pertama yang kuat sesuai dengan identitas brand Beauty Raha.

### 1.2 Tujuan Produk

- Menyampaikan informasi Grand Opening secara menarik dan profesional
- Membangun antusiasme dan ekspektasi calon tamu sebelum hari H
- Mencerminkan identitas visual brand Beauty Raha melalui desain yang elegan dan feminine
- Mempermudah penyebaran undangan melalui link yang bisa dibagikan via WhatsApp, Instagram, dan media sosial lainnya

### 1.3 Target Pengguna

| Segmen | Deskripsi |
|---|---|
| **Tamu Undangan** | Pelanggan, rekan bisnis, influencer, dan masyarakat umum |
| **Pengelola** | Tim Beauty Raha yang membagikan link undangan |

---

## 2. Ruang Lingkup

### 2.1 Yang Termasuk (In Scope)

**Pendekatan Desain — Mobile-First:**
- Semua desain dimulai dari layar mobile (320px–430px) sebagai baseline utama
- Tablet dan desktop adalah adaptasi dari layout mobile, bukan sebaliknya
- Interaksi dirancang untuk sentuhan (touch-friendly): tap target minimum 44×44px, swipe gesture, scroll alami
- Tidak ada elemen yang hanya terlihat di desktop — semua fitur accessible di mobile
- Satu halaman landing page responsif (desktop, tablet, mobile)
- Animasi interaktif berbasis CSS dan JavaScript
- Countdown timer menuju hari Grand Opening (10 April 2026)
- Informasi lengkap acara (tanggal, waktu, lokasi)
- Form konfirmasi kehadiran (RSVP) dengan input nama & status kehadiran
- Elemen visual yang konsisten dengan identitas pink brand

**Halaman Privat — Admin Guest List:**
- Halaman terpisah untuk menampilkan daftar tamu yang sudah konfirmasi
- Dilindungi password sederhana (akses hanya untuk tim Beauty Raha)
- Tabel daftar tamu: nama, status kehadiran, waktu konfirmasi
- Ringkasan statistik: total hadir, tidak hadir, ragu-ragu
- Fitur export data ke CSV

**Infrastruktur Data:**
- Penyimpanan data konfirmasi menggunakan TiDB sebagai database 

### 2.2 Yang Tidak Termasuk (Out of Scope)

- Sistem login berbasis akun (hanya password statis untuk admin)
- Notifikasi email/WhatsApp otomatis ke tamu setelah RSVP
- Fitur edit / hapus data tamu dari halaman admin
- Dashboard analitik lanjutan
- Fitur live chat atau support

---

## 3. Desain & Identitas Visual

### 3.1 Palet Warna

| Nama | Hex | Penggunaan |
|---|---|---|
| **Deep Rose** | `#C0617A` | Primary action, heading accent |
| **Blush Pink** | `#E08FA8` | Button hover, gradient |
| **Soft Pink** | `#F5C6D8` | Background section, border |
| **Petal Blush** | `#FDE8F0` | Card background, overlay |
| **Warm White** | `#FFFAF9` | Page background |
| **Gold Accent** | `#D4A96A` | Ornamen, divider, premium touch |
| **Dark Text** | `#2C1520` | Teks utama |
| **Muted Pink** | `#7A4055` | Teks sekunder, label |

### 3.2 Tipografi

| Peran | Font | Style | Penggunaan |
|---|---|---|---|
| **Display / Hero** | Cormorant Garamond | Italic, Light | Judul utama, nama brand |
| **Body / UI** | Jost | Light, Regular, Medium | Deskripsi, label, tombol |

### 3.3 Tone & Mood

- **Feminine & Elegant** — kesan mewah tapi tetap hangat
- **Clean & Modern** — ruang putih yang cukup, tidak cluttered
- **Playful Luxury** — animasi yang lembut dan menyenangkan

---

## 4. Struktur Halaman & Konten

Website terdiri dari **satu halaman panjang (long scroll)** dengan beberapa seksi berikut:

---

### Seksi 1 — Hero Section

**Tujuan:** Memberikan kesan pertama yang kuat dan menyampaikan inti undangan.

**Konten:**
- Badge teks kecil: `"Anda Diundang"`
- Judul utama: `"Grand Opening"` (display besar, italic)
- Nama brand: `"Beauty Raha"` (huruf kapital, spasi lebar)
- Tagline pendek: `"Hadir, Rayakan, Bersama Kami"` atau sejenisnya
- Countdown timer: hari, jam, menit, detik menuju **10 April 2026**
- Tombol CTA utama: `"Konfirmasi Kehadiran"`

**Animasi:**
- Fade-in staggered untuk setiap elemen (dari bawah ke atas)
- Particle / kelopak bunga yang berjatuhan di background
- Countdown timer update real-time dengan transisi angka
- Parallax ringan pada background gradient

---

### Seksi 2 — Tentang Acara

**Tujuan:** Menjelaskan acara secara singkat dan membangun antusiasme.

**Konten:**
- Sub-judul: `"Sebuah Awal yang Indah"`
- Deskripsi singkat (2–3 kalimat) tentang Beauty Raha dan momen Grand Opening
- 3 highlight card (icon + judul + deskripsi):
  - 💄 Beauty Experience
  - 🎁 Special Gift & Promo
  - ✨ Exclusive Moment

**Animasi:**
- Card muncul dengan animasi scroll-triggered (fade + slide up)
- Hover effect pada card: lift + shadow

---

### Seksi 3 — Detail Acara

**Tujuan:** Menyampaikan informasi logistik acara secara jelas.

**Konten:**
- Background gradient deep pink
- Tiga kolom info:
  - 📅 **Tanggal** — Jumat, 10 April 2026
  - 🕐 **Waktu** — *(belum tersedia — akan diisi)*
  - 📍 **Lokasi** — Beauty Raha, Raha, Kabupaten Muna, Sulawesi Tenggara
- Tombol: `"Buka di Google Maps"` → `https://maps.app.goo.gl/w8fharKwpTqkxunV7`
- Tombol: `"Simpan ke Kalender"`

**Animasi:**
- Section masuk dengan fade-in dari bawah saat di-scroll
- Decorative circle/ring animasi rotate lambat di background

---

### Seksi 4 — Galeri / Sneak Peek *(opsional)*

**Tujuan:** Membangun rasa penasaran dengan preview produk atau interior.

**Konten:**
- Grid foto 3–4 gambar dengan efek hover zoom
- Atau placeholder jika foto belum tersedia

**Animasi:**
- Masonry grid dengan staggered reveal on scroll
- Hover zoom smooth dengan overlay pink

---

### Seksi 5 — RSVP / Konfirmasi Kehadiran

**Tujuan:** Mengumpulkan konfirmasi kehadiran tamu beserta detail rombongan dan asal brand.

**Konten:**
- Judul: `"Konfirmasi Kehadiran Anda"`
- Sub-teks pendorong hadir

**Field Form:**

| No | Field | Tipe | Keterangan |
|---|---|---|---|
| 1 | **Dari Brand Apa?** | Text input | Nama brand / perusahaan / instansi tamu |
| 2 | **Jumlah Tamu yang Hadir** | Number input (min: 1) | Berapa orang dari brand tersebut yang datang |
| 3 | **Nama-nama yang Hadir** | Textarea | Daftar nama per baris, muncul & menyesuaikan jumlah dari field no.2 |

**Perilaku Dinamis:**
- Saat field "Jumlah Tamu" diisi angka **N**, maka muncul **N buah input nama** secara otomatis (contoh: isi 3 → muncul Nama 1, Nama 2, Nama 3)
- Validasi: semua input nama wajib diisi sebelum bisa submit

**Tombol & State:**
- Tombol submit: `"Kirim Konfirmasi"`
- State sukses: animasi konfeti pink + pesan terima kasih beserta nama brand
- State error: pesan gagal kirim + tombol coba lagi

**Alur Data RSVP:**
```
Tamu isi form → Submit → Google Apps Script →
Data masuk Google Sheets → Admin bisa lihat di halaman Guest List
```

**Validasi:**
- Field "Dari Brand Apa?" tidak boleh kosong (min. 2 karakter)
- Jumlah tamu minimal 1
- Semua input nama wajib terisi
- Mencegah submit ganda dari device yang sama (simpan flag di `localStorage`)

---

### Seksi 6 — Footer

**Konten:**
- Logo / nama brand: `"Beauty Raha"`
- Tagline brand
- Icon sosial media (Instagram, TikTok, WhatsApp)
- Teks copyright: `© 2026 Beauty Raha. All rights reserved.`

---

## 4B. Halaman Admin — Guest List

> **URL:** `/admin` atau `/?page=admin` — dilindungi password

### 4B.1 Login Admin

**Konten:**
- Logo Beauty Raha kecil
- Judul: `"Admin — Daftar Tamu"`
- Input password
- Tombol: `"Masuk"`
- Pesan error jika salah password

**Logika:**
- Password statis disimpan di konfigurasi (bukan database)
- Setelah login, session disimpan di `httpOnly cookie` agar akses admin tetap sederhana namun lebih aman

---

### 4B.2 Dashboard Ringkasan

**Konten — Kartu Statistik:**

| Kartu | Isi |
|---|---|
| 🏢 **Total Brand / Instansi** | Jumlah brand yang sudah konfirmasi |
| 👥 **Total Tamu Hadir** | Total seluruh orang yang akan datang |
| 📋 **Total Responden** | Jumlah form yang sudah masuk |

---

### 4B.3 Tabel Daftar Tamu

**Kolom tabel:**

| # | Nama Brand | Jumlah Tamu | Nama-nama yang Hadir | Waktu Konfirmasi |
|---|---|---|---|---|

**Fitur tabel:**
- Sorting per kolom (nama brand, jumlah tamu, waktu)
- Search by nama brand atau nama tamu
- Pagination jika data > 20 baris

**Aksi:**
- Tombol `"Export CSV"` — download seluruh data sebagai file `.csv`
- Tombol `"Refresh Data"` — reload data dari Google Sheets

---

### 4B.4 Desain Halaman Admin

- Tetap menggunakan palet pink yang sama namun lebih minimal dan fungsional
- Tabel bersih dengan border tipis dan row hover highlight pink muda
- Responsif — bisa diakses dari HP tim Beauty Raha

---

## 5. Persyaratan Teknis

### 5.1 Tech Stack

| Layer | Teknologi |
|---|---|
| **Frontend** | Next.js App Router + React |
| **Styling** | CSS Modules + global CSS |
| **Interaktivitas** | React client components + fetch API |
| **Font** | Google Fonts via `next/font` |
| **Form Backend** | TiDB dan Drizzle ORM |
| **Database** | TiDB dan Drizzle ORM |
| **Admin Auth** | Password statis via `httpOnly cookie` |
| **Hosting** | Vercel |

### 5.2 Arsitektur Data

```
[Landing Page]
    │
    │  POST (fetch API)
    ▼
[Google Apps Script Web App]   ←── URL endpoint
    │
    │  appendRow()
    ▼
[Google Sheets]
    │
    │  GET (fetch API)
    ▼
[Halaman Admin — Guest List]
```

**Struktur Google Sheets (kolom):**

| A | B | C | D |
|---|---|---|---|
| Timestamp | Nama Brand | Jumlah Tamu | Nama-nama Tamu |

> Kolom D berisi nama-nama yang dipisahkan dengan koma, contoh: `"Andi, Budi, Citra"`

### 5.2 Pendekatan Mobile-First

**Prinsip Utama:**
- CSS ditulis dengan pendekatan `min-width` (bukan `max-width`) — mobile sebagai default, desktop sebagai override
- Layout menggunakan CSS Flexbox dan Grid yang fluid dan adaptif
- Tipografi menggunakan `clamp()` agar responsif tanpa banyak breakpoint
- Semua elemen interaktif (tombol, input, pilihan) memiliki ukuran minimal **44×44px** sesuai standar touch target Apple / Google
- Gambar dan aset menggunakan format yang efisien untuk koneksi mobile

**Breakpoint:**

| Nama | Lebar | Target Device |
|---|---|---|
| **Mobile S** *(default)* | 320px | HP lama, iPhone SE |
| **Mobile M** | 375px | iPhone 12/13/14 |
| **Mobile L** | 430px | iPhone Plus, Android besar |
| **Tablet** | 768px | iPad, tablet Android |
| **Desktop** | 1024px+ | Laptop, PC |

**Prioritas Layout per Seksi:**

| Seksi | Mobile | Tablet+ |
|---|---|---|
| Hero | Full-screen, teks center, tombol full-width | Sama, padding lebih lega |
| Tentang Acara | Card stack vertikal 1 kolom | Grid 3 kolom |
| Detail Acara | Info susun vertikal | Baris horizontal |
| Form RSVP | Input full-width, stack vertikal | Max-width 480px centered |
| Admin Tabel | Kolom disederhanakan, horizontal scroll | Tabel penuh |

### 5.3 Performa & Kompatibilitas

| Kriteria | Target |
|---|---|
| **Page Load Speed** | < 3 detik pada koneksi 4G |
| **Page Load Speed Mobile** | < 2 detik pada koneksi 4G (prioritas) |
| **Lighthouse Mobile Score** | ≥ 85 (Performance, Accessibility) |
| **Browser Support** | Chrome Android, Safari iOS, Firefox Mobile, Samsung Internet |
| **Minimum Viewport** | 320px lebar |
| **Touch Target Size** | Minimum 44×44px untuk semua elemen interaktif |
| **Font Size Minimum** | 16px pada input (mencegah auto-zoom iOS Safari) |

### 5.4 Animasi & Interaktivitas

| Fitur | Teknik | Catatan Mobile |
|---|---|---|
| Hero fade-in staggered | CSS `@keyframes` + `animation-delay` | Ringan, aman di semua device |
| Kelopak bunga jatuh | `<canvas>` API | Kurangi jumlah partikel di mobile untuk performa |
| Countdown timer | `setInterval` JavaScript | — |
| Scroll reveal | `IntersectionObserver` API | Lebih halus dari scroll event listener |
| Hover / tap interaksi | CSS `transition` + `:active` state | Gunakan `:active` untuk feedback tap di mobile |
| Parallax background | CSS `transform` pada scroll event | Nonaktifkan di mobile (berat & bisa mual) |
| Form input nama dinamis | DOM manipulation JS | Input full-width, keyboard-friendly |
| Form feedback (sukses/error) | DOM manipulation JS | Pesan muncul di atas keyboard mobile |
| `prefers-reduced-motion` | CSS media query | Matikan animasi berat untuk aksesibilitas |

---

## 6. Alur Pengguna (User Flow)

### Flow 1 — Tamu Undangan (Publik)

```
Menerima link undangan (WhatsApp / Instagram)
        ↓
Buka website → Hero Section + animasi muncul
        ↓
Scroll → Baca tentang acara & detail lokasi
        ↓
Scroll → Isi form RSVP:
         1. Nama brand / instansi
         2. Jumlah tamu yang hadir → input nama muncul otomatis
         3. Isi nama satu per satu
        ↓
Submit → Data terkirim ke Google Sheets
        ↓
Muncul animasi sukses + pesan terima kasih
        ↓
Opsional: klik Google Maps / Simpan ke Kalender
```

### Flow 2 — Admin Beauty Raha (Privat)

```
Buka URL halaman admin (/admin)
        ↓
Masukkan password → Terverifikasi
        ↓
Melihat dashboard statistik (hadir / tidak / belum pasti)
        ↓
Melihat tabel daftar tamu lengkap
        ↓
Filter / sort / search sesuai kebutuhan
        ↓
Opsional: Export CSV untuk keperluan dokumentasi
```

---

## 7. Kriteria Penerimaan (Acceptance Criteria)

### Fungsional — Landing Page

- [ ] Countdown timer berjalan real-time dan akurat menuju 10 April 2026
- [ ] Semua seksi tampil dengan benar di mobile, tablet, dan desktop
- [ ] Tombol "Buka di Google Maps" membuka `https://maps.app.goo.gl/w8fharKwpTqkxunV7`
- [ ] Field "Dari Brand Apa?" wajib diisi dan tervalidasi
- [ ] Field "Jumlah Tamu" memunculkan input nama secara dinamis sesuai angka yang diisi
- [ ] Semua input nama wajib terisi sebelum bisa submit
- [ ] Form RSVP berhasil mengirim data (brand, jumlah, nama-nama) ke Google Sheets
- [ ] Animasi sukses muncul setelah submit berhasil
- [ ] Mencegah submit ganda dari device yang sama
- [ ] Tombol sosial media mengarah ke akun yang benar

### Fungsional — Halaman Admin

- [ ] Halaman admin tidak dapat diakses tanpa password yang benar
- [ ] Data tamu tampil secara real-time dari Google Sheets
- [ ] Kartu statistik menampilkan jumlah brand, total tamu, dan total responden dengan akurat
- [ ] Search by nama brand atau nama tamu berfungsi
- [ ] Sorting per kolom berfungsi
- [ ] Export CSV menghasilkan file lengkap yang bisa dibuka di Excel / Google Sheets
- [ ] Tombol Refresh memuat ulang data terbaru

### Mobile-First & UX

- [ ] Semua halaman tampil sempurna pada viewport 320px (iPhone SE)
- [ ] Tidak ada horizontal scroll yang tidak disengaja di mobile
- [ ] Semua tombol dan input memiliki ukuran minimal 44×44px
- [ ] Font size input minimal 16px (mencegah auto-zoom di iOS Safari)
- [ ] Parallax dinonaktifkan di mobile
- [ ] Jumlah partikel canvas dikurangi di mobile untuk performa
- [ ] Semua teks terbaca tanpa zoom di layar 375px
- [ ] Tabel admin bisa di-scroll horizontal di mobile tanpa merusak layout

- [ ] Animasi hero fade-in staggered berjalan saat halaman pertama dibuka
- [ ] Partikel / kelopak bunga tampil di hero section
- [ ] Elemen scroll-reveal muncul smooth saat masuk viewport
- [ ] Hover state pada card dan tombol berfungsi dengan baik
- [ ] Warna konsisten menggunakan palet pink yang sudah ditentukan
- [ ] Halaman admin tetap menggunakan identitas visual pink

### Performa

- [ ] Halaman selesai dimuat dalam < 3 detik pada koneksi 4G
- [ ] Tidak ada error di browser console pada saat production
- [ ] Gambar (jika ada) dioptimasi dengan ukuran < 200KB per gambar

---

## 8. Konten yang Perlu Disiapkan

Sebelum pengembangan selesai, tim Beauty Raha perlu menyiapkan:

| Item | Status | Detail |
|---|---|---|
| Tanggal & waktu Grand Opening | ✅ Sebagian tersedia | Jumat, 10 April 2026 — waktu belum dikonfirmasi |
| Alamat lengkap lokasi | ✅ Tersedia | Beauty Raha, Raha, Kabupaten Muna, Sulawesi Tenggara |
| Koordinat GPS | ✅ Tersedia | `-4.8408998, 122.7226622` |
| Link Google Maps | ✅ Tersedia | https://maps.app.goo.gl/w8fharKwpTqkxunV7 |
| Akun Instagram / TikTok / WhatsApp | ⬜ Belum tersedia | — |
| Foto produk / interior (opsional) | ⬜ Belum tersedia | — |
| Logo Beauty Raha (PNG transparan) | ⬜ Belum tersedia | — |
| Teks deskripsi brand (2–3 kalimat) | ⬜ Belum tersedia | — |

---

## 8.1 Data Lokasi & Acara *(Terkonfirmasi ✅)*

Data berikut sudah dikonfirmasi dan siap diimplementasikan langsung ke dalam kode website:

| Field | Value |
|---|---|
| **Tanggal Grand Opening** | Jumat, 10 April 2026 |
| **Waktu** | *(belum dikonfirmasi)* |
| **Nama Tempat** | Beauty Raha |
| **Kota** | Raha |
| **Kabupaten** | Kabupaten Muna |
| **Provinsi** | Sulawesi Tenggara |
| **Koordinat Latitude** | `-4.8408998` |
| **Koordinat Longitude** | `122.7226622` |
| **Google Maps Short Link** | `https://maps.app.goo.gl/w8fharKwpTqkxunV7` |
| **Google Maps Embed** | `https://www.google.com/maps?q=-4.8408998,122.7226622` |

---

## 9. Timeline Estimasi

| Fase | Aktivitas | Estimasi Waktu |
|---|---|---|
| **Fase 1** | Setup Google Sheets + Google Apps Script (backend) | 0.5 hari |
| **Fase 2** | Hero section + animasi utama + countdown | 1 hari |
| **Fase 3** | Seksi konten (tentang, detail acara, highlight) | 1 hari |
| **Fase 4** | Form RSVP + integrasi Google Sheets | 1 hari |
| **Fase 5** | Halaman Admin (login, statistik, tabel, export CSV) | 1.5 hari |
| **Fase 6** | Responsif mobile + polish animasi seluruh halaman | 1 hari |
| **Fase 7** | Review konten + pengisian data final | 0.5 hari |
| **Fase 8** | Testing end-to-end + deployment | 0.5 hari |
| **Total** | | **~7 Hari Kerja** |

> ⚠️ **Catatan Kritis:** Grand Opening **10 April 2026** tinggal **8 hari lagi**. Development harus dimulai segera.

---

## 10. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Waktu acara belum dikonfirmasi | Countdown kurang presisi | Gunakan placeholder pukul 10.00 WITA, update saat siap |
| Lokasi & tanggal sudah terkonfirmasi ✅ | — | Siap diimplementasikan |
| Google Apps Script quota habis | RSVP gagal tersimpan | Tampilkan error + alternatif via WhatsApp manual |
| Password admin bocor | Data tamu bisa diakses orang lain | Ganti password berkala; gunakan URL admin yang tidak mudah ditebak |
| Submit RSVP ganda dari satu orang | Data duplikat di sheets | Blokir re-submit via `localStorage` flag per device |
| Animasi berat di perangkat low-end | Performa buruk | Gunakan `prefers-reduced-motion` media query |
| Gambar tidak dioptimasi | Loading lambat | Kompres semua aset < 200KB sebelum deploy |

---

## 11. Catatan Tambahan

- **Mobile-first adalah prioritas utama** — mayoritas tamu akan membuka undangan dari HP via WhatsApp atau Instagram
- Semua CSS ditulis dengan pendekatan `min-width` media query — mobile sebagai default
- Desain harus bisa di-update kontennya dengan mudah (tanggal, waktu, dll) — semua konfigurasi dikumpulkan di bagian atas file JS
- Website berjalan sebagai aplikasi Next.js dengan route publik dan admin terpisah
- Link publik utama menggunakan route `/` atau `/content` sesuai kebutuhan distribusi
- Link `/admin` hanya dibagikan ke tim internal Beauty Raha
- Referensi desain HTML lama disimpan di `docs/archive/batch/` sebagai arsip
- Google Sheets sebagai database memudahkan tim melihat & mengolah data tamu langsung tanpa tools tambahan
- Pastikan meta viewport tag terpasang: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

---

*Dokumen ini adalah living document — dapat diperbarui seiring perkembangan proyek.*
