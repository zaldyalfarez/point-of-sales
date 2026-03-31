# ☕ AK POS — Point of Sale System

Sistem Point of Sale (POS) modern berbasis web yang dibangun dengan React, TypeScript, dan shadcn/ui. Dirancang untuk bisnis retail & F&B dengan fitur lengkap mulai dari kasir, manajemen produk, hingga laporan analitik.

---

## ✨ Fitur Utama

### 🖥️ Terminal Kasir (POS)
- **Product Grid** — Tampilan produk dengan filter kategori dan pencarian real-time
- **Product Variants** — Dukungan varian produk (ukuran, berat, rasa) dengan variant picker
- **Cart Management** — Tambah, edit kuantitas, hapus item dengan dukungan varian
- **Smart Discount** — Dropdown promo/kupon yang searchable dengan validasi otomatis
- **Payment Flow** — Dialog pembayaran multi-step dengan numpad untuk input nominal tunai
- **Quick Amount** — Tombol nominal cepat (uang pas, pembulatan) untuk mempercepat transaksi
- **Multi Payment** — Mendukung Cash, Debit Card, dan QRIS
- **Receipt** — Struk digital yang customizable dengan info toko dan pesan kustom
- **Print Receipt** — Cetak struk langsung dari browser

### 📊 Admin Dashboard
- **Dashboard Overview** — Ringkasan penjualan, pendapatan, jumlah pelanggan, dan grafik revenue
- **Low Stock Alert** — Notifikasi real-time untuk produk yang stok-nya menipis
- **Navigasi Sidebar** — Sidebar collapsible dengan grouping menu yang rapi

### 📦 Manajemen Produk
- **CRUD Produk** — Tambah, edit, hapus produk dengan form lengkap
- **Product Variants** — Kelola varian per produk (nama, SKU, price adjustment, stok)
- **Kategori** — Manajemen kategori produk
- **Stok Adjustment** — Penyesuaian stok masuk/keluar dengan catatan

### 🏷️ Promosi & Kupon
- **CRUD Promosi** — Buat dan kelola kode promo
- **Tipe Diskon** — Persentase (%) atau nominal tetap (Rp)
- **Validasi Otomatis** — Min. order, batas penggunaan, kategori yang berlaku, masa berlaku
- **Smart Selector** — Staff bisa pilih promo dari dropdown atau ketik kode manual

### 💰 Transaksi & Keuangan
- **Riwayat Transaksi** — Daftar semua transaksi dengan filter dan detail
- **Manajemen Pengeluaran** — Catat dan kelola biaya operasional
- **Laporan Analitik** — Grafik penjualan, produk terlaris, breakdown metode pembayaran

### 👥 Manajemen Staff & Pelanggan
- **Staff Management** — CRUD data staff dengan role-based access
- **Customer Database** — Data pelanggan dengan riwayat pembelian

### ⏰ Shift & Cash Register
- **Open/Close Shift** — Buka dan tutup shift kasir dengan saldo awal
- **Cash Reconciliation** — Pencocokan kas aktual vs kas yang diharapkan
- **Numpad Input** — Input saldo penutupan dengan numpad
- **Shift History** — Riwayat semua shift dengan detail sales per metode pembayaran

### 🔧 Pengaturan
- **Info Toko** — Nama, alamat, telepon, email toko
- **Konfigurasi Pajak** — Toggle on/off, atur rate (%) dan label pajak (PPN/VAT/GST)
- **Kustomisasi Struk** — Header, footer, toggle logo, preview struk real-time

### 📋 Audit Log
- **Activity Tracking** — Semua aktivitas sistem tercatat (order, produk, stok, staff, dll)
- **Filter & Search** — Filter berdasarkan action, staff, dan rentang tanggal
- **Expandable Detail** — Metadata detail untuk setiap log entry

### 🔔 Low Stock Alerts
- **Bell Notification** — Badge notifikasi di header dashboard
- **Dashboard Widget** — Card alert di halaman dashboard dengan color-coded severity
- **Sidebar Indicator** — Dot merah di menu Products saat ada stok menipis

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Framework** | React 19 + TypeScript 5.9 |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | shadcn/ui (Radix UI primitives) |
| **Icons** | Phosphor Icons (duotone) |
| **Charts** | Recharts |
| **Routing** | React Router DOM 7 |
| **Font** | DM Sans (Variable) |
| **State** | React Context API |
| **Data** | In-memory mock data (service layer ready for API integration) |

---

## 📁 Struktur Proyek

```
src/
├── App.tsx                          # Router configuration
├── main.tsx                         # Entry point + providers
├── index.css                        # Global styles & design tokens
│
├── components/ui/                   # shadcn/ui components
├── contexts/
│   └── StoreSettingsContext.tsx      # Global store settings (tax, receipt, info)
├── hooks/
│   └── use-mobile.tsx               # Responsive breakpoint hook
├── lib/
│   ├── types.ts                     # All TypeScript interfaces
│   ├── mock-data.ts                 # Mock data untuk semua entitas
│   └── utils.ts                     # Utility functions
│
├── features/
│   ├── auth/
│   │   └── pages/LoginPage.tsx      # Halaman login
│   │
│   ├── pos/
│   │   ├── pages/
│   │   │   └── POSPage.tsx          # Terminal kasir full-screen
│   │   └── components/
│   │       ├── ProductGrid.tsx      # Grid produk + variant picker
│   │       ├── CartPanel.tsx        # Panel keranjang belanja
│   │       ├── DiscountSelector.tsx # Smart coupon/promo dropdown
│   │       ├── PaymentConfirmDialog.tsx  # Dialog pembayaran + numpad
│   │       └── OrderSuccessDialog.tsx   # Dialog struk/receipt
│   │
│   └── dashboard/
│       ├── layouts/
│       │   └── DashboardLayout.tsx  # Layout sidebar + header
│       ├── components/
│       │   ├── AppSidebar.tsx       # Navigasi sidebar
│       │   ├── DashboardHeader.tsx  # Header + low stock bell
│       │   ├── LowStockAlert.tsx    # Notifikasi stok menipis
│       │   └── StatsCard.tsx        # Kartu statistik reusable
│       ├── pages/
│       │   ├── DashboardPage.tsx    # Overview & analytics
│       │   ├── ProductsPage.tsx     # Daftar produk
│       │   ├── ProductFormPage.tsx  # Form produk + varian
│       │   ├── CategoryPage.tsx     # Manajemen kategori
│       │   ├── PromotionsPage.tsx   # CRUD promosi/kupon
│       │   ├── TransactionsPage.tsx # Riwayat transaksi
│       │   ├── CustomersPage.tsx    # Data pelanggan
│       │   ├── StaffPage.tsx        # Daftar staff
│       │   ├── StaffFormPage.tsx    # Form staff
│       │   ├── ShiftManagementPage.tsx  # Kelola shift kasir
│       │   ├── StockAdjustmentPage.tsx  # Penyesuaian stok
│       │   ├── ExpensesPage.tsx     # Catat pengeluaran
│       │   ├── ReportsPage.tsx      # Laporan & grafik
│       │   ├── AuditLogPage.tsx     # Activity log
│       │   └── SettingsPage.tsx     # Pengaturan toko
│       └── services/
│           ├── product-service.ts
│           ├── category-service.ts
│           ├── transaction-service.ts
│           ├── customer-service.ts
│           ├── staff-service.ts
│           ├── stock-service.ts
│           ├── expense-service.ts
│           ├── promotion-service.ts
│           ├── audit-service.ts
│           ├── shift-service.ts
│           ├── report-service.ts
│           └── dashboard-service.ts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/ak-pos.git
cd ak-pos

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

### Login

Gunakan kredensial berikut untuk masuk:

| Field | Value |
|-------|-------|
| Email | `admin@akpos.com` |
| Password | _(sembarang, mock auth)_ |

---

## 📜 Available Scripts

| Script | Deskripsi |
|--------|-----------|
| `npm run dev` | Jalankan development server (Vite HMR) |
| `npm run build` | Type-check + build production bundle |
| `npm run preview` | Preview production build secara lokal |
| `npm run lint` | Jalankan ESLint |
| `npm run format` | Format kode dengan Prettier |
| `npm run typecheck` | Type-check TypeScript tanpa emit |

---

## 🗺️ Routing

| Path | Halaman |
|------|---------|
| `/login` | Login Page |
| `/pos` | Terminal Kasir (full-screen) |
| `/dashboard` | Dashboard Overview |
| `/dashboard/products` | Daftar Produk |
| `/dashboard/products/new` | Tambah Produk |
| `/dashboard/products/:id/edit` | Edit Produk |
| `/dashboard/categories` | Kategori |
| `/dashboard/promotions` | Promosi & Kupon |
| `/dashboard/transactions` | Riwayat Transaksi |
| `/dashboard/customers` | Pelanggan |
| `/dashboard/staff` | Staff |
| `/dashboard/staff/new` | Tambah Staff |
| `/dashboard/shifts` | Shift & Cash Register |
| `/dashboard/stock-adjustments` | Penyesuaian Stok |
| `/dashboard/expenses` | Pengeluaran |
| `/dashboard/reports` | Laporan |
| `/dashboard/audit-log` | Audit Log |
| `/dashboard/settings` | Pengaturan |

---

## 🎨 Design System

- **Color Scheme** — HSL-based dengan light/dark mode (toggle di header)
- **Typography** — DM Sans variable font
- **Icons** — Phosphor Icons (duotone weight)
- **Components** — shadcn/ui (Dialog, Select, Tabs, Switch, Popover, ScrollArea, dll)
- **Layout** — Responsive sidebar layout untuk dashboard, full-screen untuk POS terminal
- **Animations** — Micro-interactions pada hover, active states, dan transitions

---

## 🔮 Roadmap / TODO

- [ ] Integrasi backend API (REST/GraphQL)
- [ ] Database persistence (PostgreSQL/Supabase)
- [ ] Authentication & authorization (JWT/OAuth)
- [ ] Barcode scanner integration
- [ ] Thermal printer support (ESC/POS)
- [ ] Multi-outlet support
- [ ] Export laporan (PDF/Excel)
- [ ] PWA support untuk mode offline
- [ ] Role-based access control (admin, kasir, manajer)
- [ ] Multi-language (i18n)

---

## 📄 License

MIT License — free to use for personal and commercial projects.

---

<p align="center">
  Dibuat dengan ❤️ menggunakan React + TypeScript + shadcn/ui
</p>
