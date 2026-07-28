"use client";

import { X, Printer } from "lucide-react";
import type { ReportItem } from "./InvoiceTable";

interface InvoiceDetailModalProps {
  item: ReportItem;
  onClose: () => void;
}

export function InvoiceDetailModal({ item, onClose }: InvoiceDetailModalProps) {
  const handlePrint = () => {
    const printArea = document.getElementById("invoice-print-area");
    if (!printArea) return;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printArea.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-gray-900 dark:text-white flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Detail Invoice Penjualan</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Print Area */}
        <div className="flex-1 overflow-y-auto p-6" id="invoice-print-area">
          <div className="space-y-6 text-slate-300">
            {/* Invoice Header */}
            <div className="text-center pb-6 border-b border-slate-200 dark:border-slate-800 space-y-1">
              <h2 className="text-2xl font-black tracking-wider text-gray-900 dark:text-white">BursaAMVBG</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Invoice Penjualan Inventori</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-2">ID: {item.id}</p>
            </div>

            {/* Metadata Info */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-500 font-semibold uppercase tracking-wider">
                  Tanggal Transaksi
                </p>
                <p className="font-medium text-slate-200 mt-0.5">
                  {new Date(item.createdAt).toLocaleString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 font-semibold uppercase tracking-wider">
                  Status Transaksi
                </p>
                <p className="font-semibold text-emerald-400 mt-0.5">BERHASIL (OUT)</p>
              </div>
            </div>

            {/* Product Detail */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
                Item Terjual
              </p>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{item.productName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Kategori: {item.categoryName}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                    QR: {item.productQrCode}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white text-sm mt-1">
                    Rp {item.revenue.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Totals */}
            <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Subtotal Jual</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  Rp {item.revenue.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-slate-100 dark:border-slate-800/40 pt-2">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Keuntungan Bersih</span>
                <span className="font-bold text-emerald-500 dark:text-emerald-400">
                  Rp {item.profit.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-500 pt-4">
              * Terima kasih atas transaksi Anda di BursaAMVBG *
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-gray-800 dark:text-white active:scale-[0.98] transition font-semibold rounded-xl text-sm"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-linear-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 active:scale-[0.98] transition font-semibold rounded-xl text-sm flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Cetak Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
