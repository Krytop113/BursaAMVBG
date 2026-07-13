import React from "react";
import { ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";

interface DashboardOverviewProps {
  stats: {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
  };
}

export default function DashboardOverview({ stats }: DashboardOverviewProps) {
  const statsConfig = [
    {
      title: "Total Uang Masuk (Penjualan)",
      value: `Rp ${stats.totalIncome.toLocaleString("id-ID")}`,
      icon: <ArrowUpRight className="w-6 h-6 text-teal-400" />,
      bg: "bg-slate-900 border-gray-800",
      desc: "Uang masuk dari pelepasan/penjualan barang"
    },
    {
      title: "Total Uang Keluar (Pembelian)",
      value: `Rp ${stats.totalExpense.toLocaleString("id-ID")}`,
      icon: <ArrowDownLeft className="w-6 h-6 text-red-400" />,
      bg: "bg-slate-900 border-gray-800",
      desc: "Uang keluar untuk belanja modal stok produk"
    },
    {
      title: "Total Pendapatan Bersih",
      value: `Rp ${stats.netProfit.toLocaleString("id-ID")}`,
      icon: <Wallet className="w-6 h-6 text-purple-400" />,
      bg: "bg-slate-900 border-gray-800",
      desc: "Selisih bersih pendapatan dan belanja modal"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {statsConfig.map((stat, idx) => (
        <div
          key={idx}
          className={`border rounded-xl p-5 flex flex-col justify-between ${stat.bg}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-gray-400 text-sm font-medium">
                {stat.title}
              </span>
              <h3 className="text-2xl font-bold text-white mt-2 font-mono">
                {stat.value}
              </h3>
            </div>
            <div className="p-3 bg-gray-800/40 rounded-lg border border-gray-800">
              {stat.icon}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">{stat.desc}</p>
        </div>
      ))}
    </div>
  );
}
