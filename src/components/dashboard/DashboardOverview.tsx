import React from "react";
import { ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import { StatCard } from "@/components/ui";

interface DashboardOverviewProps {
  stats: {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
  };
}

export function DashboardOverview({ stats }: DashboardOverviewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        title="Total Uang Masuk (Penjualan)"
        value={`Rp ${stats.totalIncome.toLocaleString("id-ID")}`}
        icon={<ArrowUpRight className="w-5 h-5" />}
        description="Uang masuk dari pelepasan/penjualan barang"
        variant="teal"
      />

      <StatCard
        title="Total Uang Keluar (Pembelian)"
        value={`Rp ${stats.totalExpense.toLocaleString("id-ID")}`}
        icon={<ArrowDownLeft className="w-5 h-5" />}
        description="Uang keluar untuk belanja modal stok produk"
        variant="red"
      />

      <StatCard
        title="Total Pendapatan Bersih"
        value={`Rp ${stats.netProfit.toLocaleString("id-ID")}`}
        icon={<Wallet className="w-5 h-5" />}
        description="Selisih bersih pendapatan dan belanja modal"
        variant={stats.netProfit >= 0 ? "purple" : "orange"}
      />
    </div>
  );
}
