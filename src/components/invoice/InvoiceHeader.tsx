"use client";

import React from "react";
import { FileText, Download, FileSpreadsheet } from "lucide-react";

interface InvoiceHeaderProps {
  hasData: boolean;
  onDownloadPdf: () => void;
}

export function InvoiceHeader({
  hasData,
  onDownloadPdf,
}: InvoiceHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <FileText className="text-teal-400 w-7 h-7" />
          Rekapitulasi Penjualan & Invoice
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Pantau ringkasan hasil penjualan dan unduh laporan transaksi.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Download PDF Button */}
        <button
          onClick={onDownloadPdf}
          disabled={!hasData}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50 text-sm"
        >
          <Download className="w-4 h-4" />
          <span>Cetak PDF Laporan</span>
        </button>
      </div>
    </div>
  );
}
