import React from "react";
import { Package } from "lucide-react";

interface TopMutationsProps {
  mutations: Array<{
    id: string;
    productName: string;
    quantity: number;
    type: "IN" | "OUT";
    date: string;
    note: string;
  }>;
}

export default function TopMutationsTable({ mutations }: TopMutationsProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-teal-400" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Mutasi Produk Unggulan (Top 5)</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-medium">
              <th className="pb-3">Produk</th>
              <th className="pb-3 text-center">Tipe</th>
              <th className="pb-3 text-center">Jumlah</th>
              <th className="pb-3 text-right">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800/50">
            {mutations.map((trx, idx) => (
              <tr key={idx} className="text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-850/40">
                <td className="py-3">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {trx.productName}
                  </div>
                  <div className="text-[11px] text-gray-400 dark:text-gray-500">{trx.note}</div>
                </td>
                <td className="py-3 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                      trx.type === "IN"
                        ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {trx.type === "IN" ? "Masuk" : "Keluar"}
                  </span>
                </td>
                <td className="py-3 text-center font-mono">
                  {trx.quantity} unit
                </td>
                <td className="py-3 text-right text-gray-400 dark:text-gray-500 text-xs">
                  {trx.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
