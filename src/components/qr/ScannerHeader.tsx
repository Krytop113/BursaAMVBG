"use client";

import React from "react";
import { ShoppingBag, RefreshCw, Sparkles } from "lucide-react";

export function ScannerHeader() {
  return (
    <div className="flex items-center justify-between bg-gray-900/60 backdrop-blur-md border border-gray-800 p-4 rounded-2xl shadow-xl">
      <div className="flex items-center space-x-3">
        <div className="bg-teal-500/10 p-2 rounded-xl border border-teal-500/20 text-teal-400">
          <ShoppingBag className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
            Kasir Mandiri <Sparkles className="w-4 h-4 text-amber-400" />
          </h1>
          <p className="text-xs text-gray-400">Scan & simpan transaksi keluar</p>
        </div>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="text-gray-400 hover:text-white p-2 rounded-lg bg-gray-800/50 border border-gray-800 transition"
      >
        <RefreshCw className="w-4 h-4" />
      </button>
    </div>
  );
}
