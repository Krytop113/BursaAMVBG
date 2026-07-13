import React from "react";
import { Award, TrendingUp } from "lucide-react";

interface DashboardHighlightsProps {
  stats: {
    maxSpentProduct: {
      name: string;
      value: number;
    };
    maxProfitProduct: {
      name: string;
      value: number;
    };
  };
}

export default function DashboardHighlights({ stats }: DashboardHighlightsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Produk dengan Pengeluaran Terbesar */}
      <div className="bg-slate-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-gray-400 text-xs font-medium uppercase tracking-wider block">
            Produk dengan Pembelian Terbanyak (Modal Terbesar)
          </span>
          <span className="text-white font-bold text-lg block">
            {stats.maxSpentProduct.name}
          </span>
          <span className="text-red-400 font-mono text-sm block">
            Total Keluar: Rp {stats.maxSpentProduct.value.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
          <Award className="w-6 h-6" />
        </div>
      </div>

      {/* Produk dengan Profit Terbesar */}
      <div className="bg-slate-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-gray-400 text-xs font-medium uppercase tracking-wider block">
            Produk dengan Profit Terbesar (Laba Terbanyak)
          </span>
          <span className="text-white font-bold text-lg block">
            {stats.maxProfitProduct.name}
          </span>
          <span className="text-teal-400 font-mono text-sm block">
            Laba Bersih: Rp {stats.maxProfitProduct.value.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="p-3.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-xl">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
