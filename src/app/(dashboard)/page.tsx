"use client";

import React from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { SkeletonStatCard } from "@/components/ui";

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useDashboard();

  if (isLoading || !dashboardData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Dashboard Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">Memuat statistik realtime...</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, idx) => (
            <SkeletonStatCard key={idx} />
          ))}
        </div>
      </div>
    );
  }

  const { stats, latestTransactions } = dashboardData;

  const statsConfig = [
    {
      title: "Total Pendapatan",
      value: stats.totalRevenue,
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
      title: "Total Penjualan / Perubahan Stok",
      value: stats.totalTransactions.toString(),
      change: "+5.1%",
      isPositive: true,
      icon: <ShoppingCart className="w-6 h-6 text-orange-400" />,
      desc: "dari bulan lalu",
    },
    {
      title: "Tingkat Konversi",
      value: stats.conversionRate,
      change: "+1.5%",
      isPositive: true,
      icon: <TrendingUp className="w-6 h-6 text-purple-400" />,
      desc: "dari minggu lalu",
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
          Selamat datang kembali! Berikut ringkasan performa toko Anda hari ini secara real-time.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsConfig.map((stat, idx) => (
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
            <h2 className="text-lg font-bold text-white">Mutasi Stok Terbaru</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 font-medium">
                  <th className="pb-3">ID</th>
                  <th className="pb-3">Produk</th>
                  <th className="pb-3">Tipe</th>
                  <th className="pb-3">Jumlah</th>
                  <th className="pb-3 text-right">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {latestTransactions.map((trx, idx) => (
                  <tr key={idx} className="text-gray-300 hover:bg-slate-850/40">
                    <td className="py-3 font-semibold text-teal-400">
                      {trx.id}
                    </td>
                    <td className="py-3">
                      <div className="font-medium text-white">
                        {trx.productName}
                      </div>
                      <div className="text-xs text-gray-500">{trx.note}</div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          trx.type === "IN"
                            ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {trx.type === "IN" ? "Masuk" : "Keluar"}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-white">
                      {trx.quantity} unit
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
              Status Server
            </h2>
            <p className="text-gray-400 text-sm">
              Status server database dan endpoint internal.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-950/50 rounded-lg border border-gray-800">
              <span className="text-sm text-gray-400">
                Database MySQL (Prisma)
              </span>
              <span className="h-2.5 w-2.5 rounded-full bg-teal-500"></span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-950/50 rounded-lg border border-gray-800">
              <span className="text-sm text-gray-400">NextJS Server</span>
              <span className="h-2.5 w-2.5 rounded-full bg-teal-500"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
