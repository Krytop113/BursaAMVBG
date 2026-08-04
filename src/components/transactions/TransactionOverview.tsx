import React from "react";
import { ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import type { Transaction } from "./types";
import { StatCard } from "@/components/ui";

interface TransactionOverviewProps {
  transactions: Transaction[];
}

export function TransactionOverview({ transactions }: TransactionOverviewProps) {
  const totalPembelian = transactions
    .filter((t) => t.type === "IN")
    .reduce((sum, t) => sum + t.quantity * (t.productBuyPrice || 0), 0);

  const totalPengeluaran = transactions
    .filter((t) => t.type === "OUT")
    .reduce((sum, t) => sum + t.quantity * (t.productPrice || 0), 0);

  const totalBersih = totalPengeluaran - totalPembelian;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        title="Total Pembelian (Barang Masuk)"
        value={`Rp ${totalPembelian.toLocaleString("id-ID")}`}
        icon={<ArrowDownLeft className="w-5 h-5" />}
        description="Akumulasi modal belanja stok produk"
        variant="red"
      />

      <StatCard
        title="Total Penjualan (Barang Keluar)"
        value={`Rp ${totalPengeluaran.toLocaleString("id-ID")}`}
        icon={<ArrowUpRight className="w-5 h-5" />}
        description="Total omzet dari penjualan produk keluar"
        variant="teal"
      />

      <StatCard
        title="Total Pendapatan Bersih"
        value={`Rp ${totalBersih.toLocaleString("id-ID")}`}
        icon={<Wallet className="w-5 h-5" />}
        description="Selisih penjualan dikurangi modal pembelian"
        variant={totalBersih >= 0 ? "purple" : "orange"}
      />
    </div>
  );
}
