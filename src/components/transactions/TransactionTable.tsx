"use client";

import React from "react";
import { Trash2, AlertCircle, Calendar, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import type { Transaction } from "./types";

interface TransactionTableProps {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  isLoading: boolean;
  searchQuery: string;
  selectedType: string;
  onResetFilter: () => void;
  onDeleteClick: (transaction: Transaction) => void;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-800/50">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-gray-800/70 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

function TypeBadge({ type }: { type: 'IN' | 'OUT' }) {
  if (type === 'IN') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <ArrowDownLeft className="w-3.5 h-3.5" />
        Masuk (IN)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
      <ArrowUpRight className="w-3.5 h-3.5" />
      Keluar (OUT)
    </span>
  );
}

export default function TransactionTable({
  transactions,
  filteredTransactions,
  isLoading,
  searchQuery,
  selectedType,
  onResetFilter,
  onDeleteClick,
}: TransactionTableProps) {
  const isEmpty = !isLoading && filteredTransactions.length === 0;
  const hasActiveFilter = searchQuery.length > 0 || selectedType !== "Semua";

  return (
    <div className="bg-slate-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-slate-950/40 text-gray-400 font-medium text-xs uppercase tracking-wider">
              <th className="px-4 py-3.5">Tanggal</th>
              <th className="px-4 py-3.5">Nama Produk</th>
              <th className="px-4 py-3.5">Tipe</th>
              <th className="px-4 py-3.5 text-right">Jumlah</th>
              <th className="px-4 py-3.5">Catatan</th>
              <th className="px-4 py-3.5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {isLoading ? (
              [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
            ) : isEmpty ? (
              <tr>
                <td colSpan={6} className="p-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-4 bg-gray-800/40 rounded-full">
                      <AlertCircle className="w-10 h-10 text-gray-600" />
                    </div>
                    <h3 className="text-base font-semibold text-white">Transaksi Tidak Ditemukan</h3>
                    <p className="text-gray-500 text-sm max-w-sm">
                      {hasActiveFilter
                        ? "Coba gunakan kata kunci pencarian lain atau pilih tipe berbeda."
                        : 'Belum ada transaksi tercatat. Klik tombol "Catat Transaksi Baru" untuk memulai.'}
                    </p>
                    {hasActiveFilter && (
                      <button
                        onClick={onResetFilter}
                        className="mt-1 text-teal-400 text-sm hover:underline"
                      >
                        Reset semua filter
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => {
                const formattedDate = new Date(transaction.createdAt).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                });
                return (
                  <tr
                    key={transaction.id}
                    className="text-gray-300 hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-gray-600" />
                        {formattedDate}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <div className="font-semibold text-white group-hover:text-teal-400 transition-colors">
                          {transaction.productName}
                        </div>
                        <div className="text-[11px] text-gray-600 font-mono mt-0.5">
                          {transaction.productQrCode}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <TypeBadge type={transaction.type} />
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-white">
                      {transaction.quantity.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3.5 max-w-xs truncate text-gray-400">
                      {transaction.note || <span className="text-gray-600 italic">-</span>}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        title="Hapus Transaksi"
                        onClick={() => onDeleteClick(transaction)}
                        className="p-1.5 hover:bg-red-500/10 rounded-md text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table footer */}
      {!isLoading && filteredTransactions.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
          <span>
            Menampilkan <span className="text-gray-300 font-medium">{filteredTransactions.length}</span> dari{" "}
            <span className="text-gray-300 font-medium">{transactions.length}</span> transaksi
          </span>
          {selectedType !== "Semua" && (
            <button onClick={onResetFilter} className="text-teal-400 hover:underline">
              Reset filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
