"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    customer_name: "",
    car_plate: "",
    product_id: "",
    quantity: 1,
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchData = async () => {
    try {
      const [resTx, resProd] = await Promise.all([
        fetch("http://localhost:5000/api/transactions"),
        fetch("http://localhost:5000/api/products"),
      ]);
      const dataTx = await resTx.json();
      const dataProd = await resProd.json();

      setTransactions(dataTx);
      setProducts(dataProd);
      setLoading(false);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!form.product_id) {
      setMessage({
        type: "error",
        text: "Silakan pilih produk ban/velg terlebih dahulu!",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.customer_name,
          car_plate: form.car_plate,
          product_id: parseInt(form.product_id),
          quantity: parseInt(form.quantity),
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: result.message });
        // Reset form
        setForm({
          customer_name: "",
          car_plate: "",
          product_id: "",
          quantity: 1,
        });
        fetchData();
      } else {
        setMessage({
          type: "error",
          text: result.message || "Gagal memproses transaksi.",
        });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:underline font-semibold"
          >
            ← Kembali ke Data Stok Ban
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Manajemen Transaksi Ottoban Bintaro
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SISI KIRI: Form Input Transaksi Baru */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 h-fit">
            <h2 className="text-lg font-bold text-gray-700 mb-4">
              Input Pemasangan Baru
            </h2>

            {message.text && (
              <div
                className={`p-3 rounded mb-4 text-sm font-semibold ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nama Pelanggan
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 border focus:outline-blue-500 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  No. Plat Mobil
                </label>
                <input
                  type="text"
                  name="car_plate"
                  value={form.car_plate}
                  onChange={handleChange}
                  placeholder="B 1234 ABC"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 border focus:outline-blue-500 text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pilih Ban / Velg
                </label>
                <select
                  name="product_id"
                  value={form.product_id}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 border focus:outline-blue-500 text-gray-800"
                >
                  <option value="">-- Pilih Barang --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.stock === 0}>
                      {p.name}{" "}
                      {p.stock === 0 ? "(STOK HABIS)" : `(Stok: ${p.stock})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Jumlah (Qty)
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 border focus:outline-blue-500 text-gray-800"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow transition"
              >
                Simpan Transaksi
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-bold text-gray-700 mb-4">
              Log Transaksi Keluar
            </h2>

            {loading ? (
              <p className="text-gray-600">Sedang memuat data transaksi...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pelanggan / Plat
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Barang
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Harga
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-700">
                    {transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td className="px-4 py-3">
                          <div className="font-bold">{tx.customer_name}</div>
                          <div className="text-xs text-gray-400 font-mono">
                            {tx.car_plate}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium">
                            {tx.display_product_name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {tx.quantity} pcs
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-blue-600">
                          Rp {tx.total_price.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center py-4 text-gray-400"
                        >
                          Belum ada riwayat transaksi.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
