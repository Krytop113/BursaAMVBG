"use client";

import React from "react";
import { Edit2, Trash2, Eye, AlertCircle, Loader2, Tag } from "lucide-react";
import type { Product } from "./types";

interface ProductTableProps {
  products: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string;
  onResetFilter: () => void;
  onDeleteClick: (product: Product) => void;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-800/50">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-gray-800/70 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

function StatusBadge({ status, stock }: { status: string; stock: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex items-center w-fit px-2 py-0.5 rounded-full text-xs font-semibold border ${
          status === "Aktif"
            ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
            : "bg-red-500/10 text-red-400 border-red-500/20"
        }`}
      >
        {status}
      </span>
      <span className="text-[11px] text-gray-500 pl-0.5">Stok: {stock}</span>
    </div>
  );
}

function ActionButtons({ product, onDeleteClick }: { product: Product; onDeleteClick: (p: Product) => void }) {
  return (
    <div className="flex items-center justify-center gap-1">
      <button
        title="Lihat Detail"
        className="p-1.5 hover:bg-gray-800 rounded-md text-gray-500 hover:text-white transition-colors"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        title="Edit Produk"
        className="p-1.5 hover:bg-gray-800 rounded-md text-gray-500 hover:text-teal-400 transition-colors"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        title="Hapus Produk"
        onClick={() => onDeleteClick(product)}
        className="p-1.5 hover:bg-red-500/10 rounded-md text-gray-500 hover:text-red-400 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ProductTable({
  products,
  filteredProducts,
  isLoading,
  searchQuery,
  selectedCategory,
  onResetFilter,
  onDeleteClick,
}: ProductTableProps) {
  const isEmpty = !isLoading && filteredProducts.length === 0;
  const hasActiveFilter = searchQuery.length > 0 || selectedCategory !== "Semua";

  return (
    <div className="bg-slate-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Loading state */}
      {isLoading ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-slate-950/40 text-gray-400 font-medium text-xs uppercase tracking-wider">
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Nama Produk</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">QR Code</th>
                <th className="px-4 py-3.5">Harga</th>
                <th className="px-4 py-3.5">Stok / Status</th>
                <th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        </div>
      ) : isEmpty ? (
        /* Empty state */
        <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
          <div className="p-4 bg-gray-800/40 rounded-full">
            <AlertCircle className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-base font-semibold text-white">Produk Tidak Ditemukan</h3>
          <p className="text-gray-500 text-sm max-w-sm">
            {hasActiveFilter
              ? "Coba gunakan kata kunci lain atau pilih kategori berbeda."
              : 'Belum ada produk. Klik tombol "Tambah Produk Baru" untuk memulai.'}
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
      ) : (
        /* Data table */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-slate-950/40 text-gray-400 font-medium text-xs uppercase tracking-wider">
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Nama Produk</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">QR Code</th>
                <th className="px-4 py-3.5">Harga</th>
                <th className="px-4 py-3.5">Stok / Status</th>
                <th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredProducts.map((product, idx) => (
                <tr
                  key={product.id}
                  className="text-gray-300 hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-4 py-3.5 text-gray-600 text-xs">{idx + 1}</td>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-white group-hover:text-teal-400 transition-colors">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5 line-clamp-1 max-w-xs">
                      {product.description}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-800 text-gray-300 rounded-md text-xs font-medium">
                      <Tag className="w-3 h-3" />
                      {product.categoryName}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs text-gray-400 bg-slate-950 px-2 py-1 rounded border border-gray-800">
                      {product.qrCode}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-white">
                    Rp {product.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={product.status} stock={product.stock} />
                  </td>
                  <td className="px-4 py-3.5">
                    <ActionButtons product={product} onDeleteClick={onDeleteClick} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Table footer */}
      {!isLoading && filteredProducts.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
          <span>
            Menampilkan <span className="text-gray-300 font-medium">{filteredProducts.length}</span> dari{" "}
            <span className="text-gray-300 font-medium">{products.length}</span> produk
          </span>
          {selectedCategory !== "Semua" && (
            <button onClick={onResetFilter} className="text-teal-400 hover:underline">
              Reset filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
