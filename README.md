# 558NET Customer Management System

> Internet Service Provider Customer Management Dashboard

---

## 🌐 Tentang Aplikasi

558NET CMS adalah aplikasi web modern untuk mengelola data pelanggan internet ISP/RTRWNET. Dibangun dengan teknologi terkini dan terintegrasi langsung dengan Google Spreadsheet sebagai database utama.

## 🚀 Fitur Utama

- ✅ **Dashboard** - Statistik dan grafik pelanggan real-time
- ✅ **Data Pelanggan** - CRUD lengkap dengan search, filter, sorting, pagination
- ✅ **Monitoring ONT** - Deteksi duplikat SN ONT
- ✅ **Manajemen Tagihan** - Pantau status pembayaran + WhatsApp integration
- ✅ **Laporan** - Export Excel, CSV, PDF, Print
- ✅ **Google Spreadsheet** - Sinkronisasi dua arah
- ✅ **Dark/Light Mode** - Toggle tema
- ✅ **Responsive** - Mobile & Desktop friendly
- ✅ **Netlify Ready** - Deploy langsung

## 🛠️ Teknologi

- **Frontend**: React.js 19 + Vite + TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Database**: Google Spreadsheet
- **API**: Google Apps Script
- **Export**: xlsx, jsPDF
- **Deployment**: Netlify

## 📋 Kredensial Default

```
Username: admin
Password: 558net
```

## ⚙️ Setup Google Spreadsheet

### 1. Buat Google Spreadsheet

1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru
3. Catat **Sheet ID** dari URL: `https://docs.google.com/spreadsheets/d/**SHEET_ID**/edit`

### 2. Setup Google Apps Script

1. Di Google Sheets, buka **Extensions → Apps Script**
2. Hapus kode yang ada
3. Copy-paste isi file `google-apps-script/Code.gs`
4. Klik **Save** (Ctrl+S)
5. Klik **Deploy → New Deployment**
6. Pilih tipe: **Web App**
7. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
8. Klik **Deploy**
9. Copy **Web App URL**

### 3. Konfigurasi Aplikasi

1. Buka halaman **Pengaturan** di dashboard
2. Paste **Google Apps Script URL**
3. Paste **Google Sheet ID**
4. Klik **Simpan Konfigurasi**
5. Klik **Refresh & Sync**

## 🌍 Deploy ke Netlify

### Otomatis (GitHub)

1. Push kode ke GitHub
2. Login ke [Netlify](https://netlify.com)
3. **New site from Git** → pilih repository
4. Build settings sudah terkonfigurasi di `netlify.toml`
5. Deploy!

### Manual

```bash
npm install
npm run build
# Upload folder dist/ ke Netlify
```

### Environment Variables (Opsional)

Di Netlify dashboard, tambahkan:
```
VITE_GOOGLE_SHEET_ID=your_sheet_id
VITE_GOOGLE_APPS_SCRIPT_URL=your_script_url
```

## 📊 Struktur Spreadsheet

Sheet: **Pelanggan**

| Kolom | Keterangan |
|-------|-----------|
| ID Pelanggan | Format: 558NET-XXXX |
| Nama Pelanggan | Nama lengkap |
| NIK | 16 digit |
| Alamat | Alamat lengkap |
| Nomor WhatsApp | Format: 08XXXXXXXXXX |
| Tanggal Registrasi | Format: YYYY-MM-DD |
| SN ONT | Serial Number ONT |
| Paket Internet | Nama paket |
| Kecepatan | Contoh: 30 Mbps |
| Harga Bulanan | Angka (tanpa format) |
| Status Pembayaran | Lunas/Belum Lunas/Menunggak |
| Tanggal Jatuh Tempo | Format: YYYY-MM-DD |
| Status Pelanggan | Aktif/Suspend/Nonaktif |
| ODP | Nama ODP |
| Router | Model router/ONT |
| IP Address | IP lokal pelanggan |
| Catatan | Catatan admin |

## 🏗️ Arsitektur

```
Dashboard (React.js)
      ↕
Google Apps Script API (Web App)
      ↕
Google Spreadsheet (Database)
```

## 📱 Screenshots

- Login Page dengan animasi modern
- Dashboard dengan 8 stat cards + 4 grafik
- Tabel pelanggan dengan filter lengkap
- Modal tambah/edit pelanggan
- Monitoring ONT dengan deteksi duplikat
- Manajemen tagihan dengan WhatsApp integration
- Halaman laporan dengan export

## 📝 Lisensi

© 2025 558NET - Internet Service Provider
