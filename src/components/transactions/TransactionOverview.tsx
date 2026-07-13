import React from "react";
import { ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import type { Transaction } from "./types";

interface TransactionOverviewProps {
  transactions: Transaction[];
}

export default function TransactionOverview({ transactions }: TransactionOverviewProps) {
  const totalPembelian = transactions
    .filter((t) => t.type === "IN")
    .reduce((sum, t) => sum + t.quantity * (t.productBuyPrice || 0), 0);

  const totalPengeluaran = transactions
    .filter((t) => t.type === "OUT")
    .reduce((sum, t) => sum + t.quantity * (t.productPrice || 0), 0);

  const totalBersih = totalPengeluaran - totalPembelian;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Card Pembelian */}
      <div className="bg-slate-900 border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-gray-400 text-xs font-medium">Total Pembelian (Barang Masuk)</span>
            <h3 className="text-xl font-bold text-red-400 mt-1 font-mono">
              Rp {totalPembelian.toLocaleString("id-ID")}
            </h3>
          </div>
          <div className="p-2.5 bg-red-500/10 rounded-lg border border-red-500/20 text-red-400">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>
        <p className="text-[11px] text-gray-500 mt-2">Akumulasi modal belanja stok produk</p>
      </div>

      {/* Card Pengeluaran / Penjualan */}
      <div className="bg-slate-900 border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-gray-400 text-xs font-medium">Total Penjualan (Barang Keluar)</span>
            <h3 className="text-xl font-bold text-teal-400 mt-1 font-mono">
              Rp {totalPengeluaran.toLocaleString("id-ID")}
            </h3>
          </div>
          <div className="p-2.5 bg-teal-500/10 rounded-lg border border-teal-500/20 text-teal-400">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <p className="text-[11px] text-gray-500 mt-2">Total omzet dari penjualan produk keluar</p>
      </div>

      {/* Card Laba Bersih */}
      <div className="bg-slate-900 border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-gray-400 text-xs font-medium">Total Pendapatan Bersih</span>
            <h3 className={`text-xl font-bold mt-1 font-mono ${totalBersih >= 0 ? "text-purple-400" : "text-orange-500"}`}>
              Rp {totalBersih.toLocaleString("id-ID")}
            </h3>
          </div>
          <div className="p-2.5 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-400">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <p className="text-[11px] text-gray-500 mt-2">Selisih penjualan dikurangi modal pembelian</p>
      </div>
    </div>
  );
}
