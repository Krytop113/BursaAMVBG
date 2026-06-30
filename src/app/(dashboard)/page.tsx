import React from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function Dashboard() {
  // Mock data for the dashboard
  const stats = [
    {
      title: "Total Pendapatan",
      value: "Rp 45.231.890",
      change: "+12.5%",
      isPositive: true,
      icon: <DollarSign className="w-6 h-6 text-teal-400" />,
      desc: "dari bulan lalu",
    },
    {
      title: "Pengunjung Aktif",
      value: "2.405",
      change: "+4.2%",
      isPositive: true,
      icon: <Users className="w-6 h-6 text-blue-400" />,
      desc: "dari minggu lalu",
    },
    {
      title: "Total Penjualan",
      value: "1.250",
      change: "-2.1%",
      isPositive: false,
      icon: <ShoppingCart className="w-6 h-6 text-orange-400" />,
      desc: "dari bulan lalu",
    },
    {
      title: "Tingkat Konversi",
      value: "4.8%",
      change: "+1.5%",
      isPositive: true,
      icon: <TrendingUp className="w-6 h-6 text-purple-400" />,
      desc: "dari minggu lalu",
    },
  ];

  const transactions = [
    {
      id: "TRX-0091",
      customer: "Javier Leander",
      email: "javier@example.com",
      product: "AMV Background Pack v3",
      amount: "Rp 250.000",
      status: "Sukses",
      date: "28 Jun 2026",
    },
    {
      id: "TRX-0090",
      customer: "Ahmad Faisal",
      email: "ahmad@example.com",
      product: "Overlay Neon VFX Bundle",
      amount: "Rp 175.000",
      status: "Pending",
      date: "27 Jun 2026",
    },
    {
      id: "TRX-0089",
      customer: "Budi Santoso",
      email: "budi@example.com",
      product: "Kinetic Typography Preset",
      amount: "Rp 120.000",
      status: "Sukses",
      date: "26 Jun 2026",
    },
    {
      id: "TRX-0088",
      customer: "Siti Rahma",
      email: "siti@example.com",
      product: "Retro VHS Overlay Pack",
      amount: "Rp 95.000",
      status: "Gagal",
      date: "25 Jun 2026",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          Dashboard Analytics
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Selamat datang kembali! Berikut ringkasan performa toko Anda hari ini.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-gray-800 rounded-xl p-6 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-gray-400 text-sm font-medium">
                  {stat.title}
                </span>
                <h3 className="text-2xl font-bold text-white mt-2">
                  {stat.value}
                </h3>
              </div>
              <div className="p-3 bg-gray-800/40 rounded-lg border border-gray-800">
                {stat.icon}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs">
              <span
                className={`flex items-center gap-1 font-semibold ${stat.isPositive ? "text-teal-400" : "text-red-400"}`}
              >
                {stat.isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {stat.change}
              </span>
              <span className="text-gray-500">{stat.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction & Info Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Table Column */}
        <div className="xl:col-span-2 bg-slate-900 border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">Transaksi Terbaru</h2>
            <button className="text-teal-400 text-xs hover:underline">
              Lihat Semua
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-850 text-gray-400 font-medium">
                  <th className="pb-3">ID Transaksi</th>
                  <th className="pb-3">Pelanggan</th>
                  <th className="pb-3">Produk</th>
                  <th className="pb-3">Nominal</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {transactions.map((trx, idx) => (
                  <tr key={idx} className="text-gray-300 hover:bg-slate-850/40">
                    <td className="py-3 font-semibold text-teal-400">
                      {trx.id}
                    </td>
                    <td className="py-3">
                      <div className="font-medium text-white">
                        {trx.customer}
                      </div>
                      <div className="text-xs text-gray-500">{trx.email}</div>
                    </td>
                    <td className="py-3">{trx.product}</td>
                    <td className="py-3 font-medium text-white">
                      {trx.amount}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          trx.status === "Sukses"
                            ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                            : trx.status === "Pending"
                              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {trx.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-gray-500">
                      {trx.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Tips Column */}
        <div className="bg-slate-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-2">
              Informasi Server
            </h2>
            <p className="text-gray-400 text-sm">
              Status server database dan endpoint internal.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-950/50 rounded-lg border border-gray-850">
              <span className="text-sm text-gray-400">
                Database MySQL Connection
              </span>
              <span className="h-2.5 w-2.5 rounded-full bg-teal-500"></span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-950/50 rounded-lg border border-gray-850">
              <span className="text-sm text-gray-400">Next.js Dev Server</span>
              <span className="h-2.5 w-2.5 rounded-full bg-teal-500"></span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-950/50 rounded-lg border border-gray-850">
              <span className="text-sm text-gray-400">API Status</span>
              <span className="h-2.5 w-2.5 rounded-full bg-teal-500"></span>
            </div>
          </div>

          <div className="pt-2">
            <div className="p-4 bg-teal-950/20 border border-teal-500/20 rounded-lg text-teal-400 text-xs leading-relaxed">
              <strong>Info Pembelajaran:</strong> Anda telah memigrasikan
              Express ke Next.js Full-Stack. Halaman ini di-render secara
              server-side secara default, namun komponen interaktif dapat dengan
              mudah menggunakan hooks seperti `useState` di client.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
