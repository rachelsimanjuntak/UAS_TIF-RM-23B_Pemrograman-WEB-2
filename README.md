# Sistem Manajemen Informasi Bengkel - Ottoban Cabang Bintaro

Aplikasi Full-Stack Web App berbasis arsitektur terpisah (Express API Backend & Next.js Frontend) untuk mengelola data inventaris ban/velg serta pencatatan transaksi pemasangan unit yang otomatis memotong jumlah stok barang secara real-time.

Aplikasi ini dibangun untuk memenuhi syarat Tugas Ujian Akhir Semester (UAS) mata kuliah Pemrograman Web 2.

## Fitur Utama
1. **Dashboard Ringkasan Eksekutif:** Menampilkan total varian barang, akumulasi seluruh stok gudang, dan notifikasi barang dengan status menipis secara langsung.
2. **Katalog & Manajerial Produk (CRUD Rumpun 1):** Manajemen data ban, velg, dan aksesoris lengkap beserta kontrol perubahan harga maupun penghapusan item.
3. **Pencatatan Transaksi Cerdas (CRUD Rumpun 2):** Input log transaksi keluar yang terelasi secara ACID Transaction dengan database MySQL untuk melakukan pemotongan stok otomatis serta mengunci data historis (Snapshot Data) jika produk induk dihapus di kemudian hari.

---

## Struktur Folder Project (Monorepo)

```text
ottoban-bintaro-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── productController.js
│   │   └── transactionController.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   └── transactionRoutes.js
│   └── index.js
├── frontend/
│   ├── app/
│   │   ├── transactions/
│   │   │   └── page.js
│   │   ├── layout.js
│   │   └── page.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
