"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    sku: "",
    name: "",
    category: "Ban",
    price: "",
    stock: "",
  });
  const [message, setMessage] = useState("");

  const fetchProducts = () => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data produk:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Hitung data statistik dashboard
  const totalVariants = products.length;
  const totalStock = products.reduce((acc, curr) => acc + curr.stock, 0);
  const lowStockItems = products.filter((p) => p.stock < 5).length;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: form.sku,
          name: form.name,
          category: form.category,
          price: parseInt(form.price),
          stock: parseInt(form.stock),
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("Produk baru sukses didaftarkan!");
        setForm({ sku: "", name: "", category: "Ban", price: "", stock: "" });
        fetchProducts();
      } else {
        setMessage("Gagal: " + result.error);
      }
    } catch (err) {
      setMessage("Terjadi kesalahan jaringan.");
    }
  };

  const handleEdit = async (product) => {
    const newPrice = prompt(`Masukkan Harga Baru untuk ${product.name}:`, product.price);
    if (newPrice === null) return;

    const newStock = prompt(`Masukkan Jumlah Stok Baru:`, product.stock);
    if (newStock === null) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: product.sku,
          name: product.name,
          category: product.category,
          price: parseInt(newPrice),
          stock: parseInt(newStock),
        }),
      });

      if (res.ok) {
        setMessage(`Produk ${product.sku} berhasil diperbarui!`);
        fetchProducts();
      } else {
        alert("Gagal memperbarui produk.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, sku) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus produk dengan SKU: ${sku}?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage(`Produk ${sku} berhasil dihapus.`);
        fetchProducts();
      } else {
        alert("Gagal menghapus produk.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-6 border-b pb-4 flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Ottoban</h1>
            <p className="text-gray-500 text-sm">Sistem Manajemen Informasi Bengkel</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/transactions" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded shadow transition-all">
              Kelola Transaksi →
            </Link>
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              Koneksi API Sukses
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col">
            <span className="text-gray-400 text-xs font-medium uppercase">Total Varian Produk</span>
            <span className="text-2xl font-bold text-gray-800 mt-1">{totalVariants} Jenis</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col">
            <span className="text-gray-400 text-xs font-medium uppercase">Total Stok Gudang</span>
            <span className="text-2xl font-bold text-blue-600 mt-1">{totalStock} Pcs</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col">
            <span className="text-gray-400 text-xs font-medium uppercase">Stok Menipis (&lt; 5)</span>
            <span className={`text-2xl font-bold mt-1 ${lowStockItems > 0 ? "text-red-500 animate-pulse" : "text-gray-800"}`}>
              {lowStockItems} Produk
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-fit">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Tambah Stok/Varian</h2>
            {message && (
              <div className="p-2 bg-blue-50 text-blue-800 text-xs font-semibold rounded mb-3">
                {message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600">Kode SKU</label>
                <input type="text" name="sku" value={form.sku} onChange={handleChange} placeholder="Misal: BRID-EOP-16" required className="mt-1 block w-full rounded-md border p-2 text-sm bg-gray-50 focus:outline-blue-500 text-gray-800" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">Nama Barang</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nama Ban/Velg" required className="mt-1 block w-full rounded-md border p-2 text-sm bg-gray-50 focus:outline-blue-500 text-gray-800" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">Kategori</label>
                <select name="category" value={form.category} onChange={handleChange} className="mt-1 block w-full rounded-md border p-2 text-sm bg-gray-50 focus:outline-blue-500 text-gray-800">
                  <option value="Ban">Ban</option>
                  <option value="Velg">Velg</option>
                  <option value="Aksesoris">Aksesoris</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">Harga Satuan</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} required className="mt-1 block w-full rounded-md border p-2 text-sm bg-gray-50 focus:outline-blue-500 text-gray-800" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600">Jumlah Stok Awal</label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange} required className="mt-1 block w-full rounded-md border p-2 text-sm bg-gray-50 focus:outline-blue-500 text-gray-800" />
              </div>
              <button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded text-sm shadow transition-all">
                Simpan Produk
              </button>
            </form>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Stok Inventaris Aktif</h2>
            {loading ? (
              <p className="text-gray-600 text-sm">Sedang memuat data...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm p-5 border border-gray-200 flex flex-col justify-between transform transition-all duration-300 hover:scale-[102%] hover:shadow-md">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                          {product.sku}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          product.category === 'Ban' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {product.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-800 text-base line-clamp-2 h-12 mb-2">{product.name}</h3>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mt-4 border-t pt-2">
                        <span className="text-gray-500 text-xs">
                          Stok: <strong className={product.stock < 5 ? "text-red-500 font-bold" : "text-gray-700"}>{product.stock} pcs</strong>
                        </span>
                        <span className="text-blue-600 font-bold text-sm">
                          Rp {product.price.toLocaleString("id-ID")}
                        </span>
                      </div>

                      <div className="flex gap-2 mt-3 pt-2 border-t border-dashed">
                        <button onClick={() => handleEdit(product)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs py-1.5 px-2 rounded transition-all">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(product.id, product.sku)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold text-xs py-1.5 px-2 rounded transition-all">
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}