"use client";

import React, { useState, useEffect } from "react";
import { Trash2, AlertCircle, Calendar, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import type { Transaction } from "@/types";


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
    <tr className="border-b border-slate-200 dark:border-gray-800/50">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-slate-200 dark:bg-gray-800/70 rounded animate-pulse" />
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

export function TransactionTable({
  transactions,
  filteredTransactions,
  isLoading,
  searchQuery,
  selectedType,
  onResetFilter,
  onDeleteClick,
}: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredTransactions.length]);

  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const isEmpty = !isLoading && filteredTransactions.length === 0;
  const hasActiveFilter = searchQuery.length > 0 || selectedType !== "Semua";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-950/40 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
              <th className="px-4 py-3.5">Tanggal</th>
              <th className="px-4 py-3.5">Nama Produk</th>
              <th className="px-4 py-3.5">Tipe</th>
              <th className="px-4 py-3.5 text-right">Jumlah</th>
              <th className="px-4 py-3.5">Catatan</th>
              <th className="px-4 py-3.5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800/50">
            {isLoading ? (
              [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
            ) : isEmpty ? (
              <tr>
                <td colSpan={6} className="p-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-4 bg-slate-100 dark:bg-gray-800/40 rounded-full">
                      <AlertCircle className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Transaksi Tidak Ditemukan</h3>
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
              paginatedTransactions.map((transaction) => {
                const formattedDate = new Date(transaction.createdAt).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                });
                return (
                  <tr
                    key={transaction.id}
                    className="text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-gray-600" />
                        {formattedDate}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                          {transaction.productName}
                        </div>
                        <div className="text-[11px] text-gray-400 dark:text-gray-600 font-mono mt-0.5">
                          {transaction.productQrCode}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <TypeBadge type={transaction.type} />
                    </td>
                    <td className="px-4 py-3.5 text-right font-semibold text-gray-900 dark:text-white">
                      {transaction.quantity.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3.5 max-w-xs truncate text-gray-500 dark:text-gray-400">
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

      {/* Table footer with Pagination */}
      {!isLoading && totalItems > 0 && (
        <div className="px-4 py-3 border-t border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>
            Menampilkan <span className="text-gray-300 font-medium">{totalItems > 0 ? startIndex + 1 : 0}</span>-
            <span className="text-gray-300 font-medium">{endIndex}</span> dari{" "}
            <span className="text-gray-300 font-medium">{totalItems}</span> transaksi
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-950 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900 disabled:opacity-50 transition-colors"
              >
                Sebelumnya
              </button>
              <span className="text-gray-400">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-950 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900 disabled:opacity-50 transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          )}

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
