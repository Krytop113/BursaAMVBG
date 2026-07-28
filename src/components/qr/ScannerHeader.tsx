"use client";

import React from "react";
import { ShoppingBag, RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function ScannerHeader() {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-900/60 backdrop-blur-md border border-slate-200 dark:border-gray-800 p-4 rounded-2xl shadow-xl">
      <div className="flex items-center space-x-3">
        <div className="bg-teal-500/10 p-2 rounded-xl border border-teal-500/20 text-teal-500 dark:text-teal-400">
          <ShoppingBag className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-1">
            Kasir Mandiri
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Scan & simpan transaksi keluar</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          onClick={() => window.location.reload()}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-lg bg-slate-100 dark:bg-gray-800/50 border border-slate-200 dark:border-gray-800 transition"
          title="Muat Ulang Halaman"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
