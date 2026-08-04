import React from "react";
import { Award, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/ui";

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

export function DashboardHighlights({ stats }: DashboardHighlightsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatCard
        title="Produk dengan Pembelian Terbanyak (Modal Terbesar)"
        value={stats.maxSpentProduct.name}
        icon={<Award className="w-5 h-5" />}
        description={`Total Keluar: Rp ${stats.maxSpentProduct.value.toLocaleString("id-ID")}`}
        variant="red"
      />

      <StatCard
        title="Produk dengan Profit Terbesar (Laba Terbanyak)"
        value={stats.maxProfitProduct.name}
        icon={<TrendingUp className="w-5 h-5" />}
        description={`Laba Bersih: Rp ${stats.maxProfitProduct.value.toLocaleString("id-ID")}`}
        variant="teal"
      />
    </div>
  );
}
