# Sistem Manajemen Informasi Bengkel - Ottoban

Aplikasi Full-Stack Web App berbasis arsitektur terpisah (Express API Backend & Next.js Frontend) untuk mengelola data inventaris ban/velg serta pencatatan transaksi pemasangan unit yang otomatis memotong jumlah stok barang secara real-time.

Aplikasi ini dibangun untuk memenuhi syarat Tugas Ujian Akhir Semester (UAS) mata kuliah Pemrograman Web 2.

## Identitas Mahasiswa

| Kategori | Informasi |
| :--- | :--- |
| **Nama Lengkap** | Rachel Simanjuntak |
| **Kelas** | TIF-RM-23B |
| **Mata Kuliah** | Pemrograman Web 2 (UAS - Project)|
| **Tema Aplikasi** | Sistem Manajemen Informasi|
| **Status Repositori**| Monorepo (Full-Stack)|

## Fitur Utama
1. **Dashboard Ringkasan Eksekutif:** Menampilkan total varian barang, akumulasi seluruh stok gudang, dan notifikasi barang dengan status menipis secara langsung.
2. **Katalog & Manajerial Produk:** Manajemen data ban, velg, dan aksesoris lengkap beserta kontrol perubahan harga maupun penghapusan item.
3. **Pencatatan Transaksi Cerdas:** Input log transaksi keluar yang terelasi secara ACID Transaction dengan database MySQL untuk melakukan pemotongan stok otomatis serta mengunci data historis (Snapshot Data) jika produk induk dihapus di kemudian hari.

---

## Struktur Folder Project (Monorepo)

```text
ottoban/
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
```

---

# Panduan Instalasi & Menjalankan di Lokal

## 1. Clone Repositori
Pertama pilih folder tertentu sebagai direktori proyek ini
```
git clone [https://github.com/rachelsimanjuntak/UAS_TIF-RM-23B_Pemrograman-WEB-2.git](https://github.com/rachelsimanjuntak/UAS_TIF-RM-23B_Pemrograman-WEB-2.git)
cd UAS_TIF-RM-23B_Pemrograman-WEB-2
```

## 2. Konfigurasi Database MySQL
1. Pastikan server MySQL lokal kalian aktif seperti XAMPP atau Laragon
2. Buat database baru bernama ottoban atau apapun itu sesuka kalian
3. Jalankan Query SQL berikut untuk membuat struktur tabel dan relasinya
```
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category ENUM('Ban', 'Velg', 'Aksesoris') NOT NULL,
    price INT NOT NULL,
    stock INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    car_plate VARCHAR(20) NOT NULL,
    product_id INT,
    product_name_snapshot VARCHAR(255),
    quantity INT NOT NULL,
    total_price INT NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);
```

## 3. Jalankan server backend
1. Masuk ke direktori backend dan install depedensi Node.js (Pastikan sudah berada di direktori backend):
```
npm install
```
2. Buat file .env di dalam folder backend/ dan sesuaikan settingan SQL-nya:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ottoban (atau nama database kalian)
```
3. Jalankan server backend-nya dengan perintah berikut:
```
node index.js
```

## 4. Jalankan server frontend
1. Masuk ke direktori frontend dan install depedensi Node.js (Pastikan sudah berada di direktori frontend):
```
npm install
```
2. Jalankan server frontend-nya dengan perintah berikut:
```
npm run dev
```

## 5. Buka browser untuk mengecek apakah proyek ini sudah bisa diakses atau belum
```
http://localhost:3000/
```
