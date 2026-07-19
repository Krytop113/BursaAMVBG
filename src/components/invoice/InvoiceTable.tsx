"use client";

import { FileText, Inbox } from "lucide-react";

interface ReportItem {
  id: string;
  productId: string;
  productName: string;
  productQrCode: string;
  categoryName: string;
  price: number;
  buyPrice: number;
  quantity: number;
  revenue: number;
  cost: number;
  profit: number;
  createdAt: string;
}

interface InvoiceTableProps {
  items: ReportItem[];
  isLoading: boolean;
  onSelectInvoice: (item: ReportItem) => void;
}

export function InvoiceTable({ items, isLoading, onSelectInvoice }: InvoiceTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Memuat data rekapitulasi...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
        <Inbox className="w-12 h-12 text-gray-600" />
        <div className="space-y-1">
          <p className="font-semibold text-gray-300">Tidak Ada Data</p>
          <p className="text-xs text-gray-500 max-w-xs">
            Tidak ada data penjualan keluar yang ditemukan untuk kriteria filter ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="bg-gray-950 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-800">
          <tr>
            <th className="px-6 py-4">Tanggal</th>
            <th className="px-6 py-4">Nama Produk</th>
            <th className="px-6 py-4 text-center">Kuantitas</th>
            <th className="px-6 py-4 text-right">Harga Jual</th>
            <th className="px-6 py-4 text-right">Omset</th>
            <th className="px-6 py-4 text-right">Untung</th>
            <th className="px-6 py-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/60">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-800/30 transition">
              <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                {new Date(item.createdAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-semibold text-white leading-snug">{item.productName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.categoryName} • Barcode: {item.productQrCode}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4 text-center font-semibold text-gray-200">
                {item.quantity}
              </td>
              <td className="px-6 py-4 text-right font-medium">
                Rp {item.price.toLocaleString("id-ID")}
              </td>
              <td className="px-6 py-4 text-right font-bold text-white">
                Rp {item.revenue.toLocaleString("id-ID")}
              </td>
              <td className="px-6 py-4 text-right font-semibold text-emerald-400">
                Rp {item.profit.toLocaleString("id-ID")}
              </td>
              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => onSelectInvoice(item)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-slate-700 text-teal-400 rounded-lg text-xs font-semibold transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Invoice
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type { ReportItem };
