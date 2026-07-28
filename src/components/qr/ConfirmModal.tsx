"use client";

import React from "react";
import { ShoppingCart, X, Minus, Plus } from "lucide-react";
import type { Product } from "@/components/products/types";

interface ConfirmModalProps {
  product: Product;
  quantity: number;
  maxQty: number;
  onClose: () => void;
  onConfirm: () => void;
  onQuantityChange: (qty: number) => void;
}

export function ConfirmModal({
  product,
  quantity,
  maxQty,
  onClose,
  onConfirm,
  onQuantityChange,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 space-y-6 text-gray-900 dark:text-white transform transition-all duration-300 animate-in slide-in-from-bottom">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-teal-500/10 rounded-xl text-teal-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-slate-100">Konfirmasi Barang</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">Barcode/QR: {product.qrCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Detail Produk */}
        <div className="space-y-2">
          <h4 className="font-bold text-xl text-gray-900 dark:text-slate-100 leading-tight">
            {product.name}
          </h4>
          {product.description && (
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
              {product.description}
            </p>
          )}
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/60 mt-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-slate-400">Harga</p>
              <p className="font-bold text-teal-600 dark:text-teal-400 text-lg">
                Rp {Number(product.price).toLocaleString("id-ID")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-slate-400">Stok Tersedia</p>
              <p className="font-semibold text-gray-900 dark:text-slate-200">
                {product.stock} pcs
              </p>
            </div>
          </div>
        </div>

        {/* Input Kuantitas */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 tracking-wider uppercase block">
            Jumlah Barang Yang Dibeli
          </label>
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 rounded-2xl p-2 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition active:scale-95 text-gray-800 dark:text-slate-200 disabled:opacity-30 disabled:pointer-events-none"
            >
              <Minus className="w-5 h-5" />
            </button>
            
            <input
              type="number"
              min="1"
              max={maxQty}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (isNaN(val) || val < 1) {
                  onQuantityChange(1);
                } else if (val > maxQty) {
                  onQuantityChange(maxQty);
                } else {
                  onQuantityChange(val);
                }
              }}
              className="flex-1 text-center bg-transparent border-0 text-2xl font-bold text-teal-600 dark:text-teal-400 focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />

            <button
              type="button"
              onClick={() => onQuantityChange(Math.min(maxQty, quantity + 1))}
              disabled={quantity >= maxQty}
              className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition active:scale-95 text-gray-800 dark:text-slate-200 disabled:opacity-30 disabled:pointer-events-none"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {maxQty < product.stock && (
            <p className="text-[11px] text-amber-500/10 dark:text-amber-400">
              * Kuantitas dibatasi karena produk ini sudah ada di keranjang ({product.stock - maxQty} pcs).
            </p>
          )}
        </div>

        {/* Aksi Modal */}
        <div className="flex space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-gray-800 dark:text-white active:scale-[0.98] transition font-semibold rounded-2xl border border-slate-200 dark:border-slate-700/60"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 bg-linear-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white active:scale-[0.98] transition font-semibold rounded-2xl shadow-lg shadow-teal-500/20"
          >
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
}
