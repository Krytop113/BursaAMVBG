import React from "react";
import { AlertTriangle } from "lucide-react";

interface LowStockProductsProps {
  products: Array<{
    id: string;
    name: string;
    stock: number;
    price: number;
    categoryName: string;
  }>;
}

export default function LowStockTable({ products }: LowStockProductsProps) {
  return (
    <div className="bg-slate-900 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-orange-500" />
        <h2 className="text-lg font-bold text-white">Stok Produk Terendah</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 font-medium">
              <th className="pb-3">Nama Produk</th>
              <th className="pb-3">Kategori</th>
              <th className="pb-3 text-center">Jumlah Stok</th>
              <th className="pb-3 text-right">Harga Jual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {products.map((p, idx) => (
              <tr key={idx} className="text-gray-300 hover:bg-slate-850/40">
                <td className="py-3 font-semibold text-white">
                  {p.name}
                </td>
                <td className="py-3 text-gray-400">
                  {p.categoryName}
                </td>
                <td className="py-3 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      p.stock <= 5
                        ? "bg-red-500/15 text-red-400 border border-red-500/20"
                        : p.stock <= 15
                        ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                        : "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                    }`}
                  >
                    {p.stock} unit
                  </span>
                </td>
                <td className="py-3 text-right font-mono text-gray-400">
                  Rp {p.price.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
