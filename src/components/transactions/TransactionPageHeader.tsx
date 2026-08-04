"use client";

import { Plus } from "lucide-react";

interface TransactionPageHeaderProps {
  onAddClick: () => void;
}

export function TransactionPageHeader({ onAddClick }: TransactionPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">Kelola Transaksi</h1>
        <p className="text-gray-400 text-sm mt-1">
          Catat dan lacak riwayat masuk dan keluar barang.
        </p>
      </div>
      <button
        id="btn-tambah-transaksi"
        onClick={onAddClick}
        className="flex items-center justify-center gap-2 bg-teal-500 text-slate-950 font-semibold px-4 py-2.5 rounded-lg hover:bg-teal-400 active:scale-95 transition-all duration-200 shadow-lg shadow-teal-500/20 text-sm"
      >
        <Plus className="w-5 h-5" />
        Catat Transaksi Baru
      </button>
    </div>
  );
}
