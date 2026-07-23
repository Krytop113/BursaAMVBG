"use client";

import React from "react";
import { ShoppingBag, Minus, Plus, Trash2, Loader2 } from "lucide-react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  qrCode: string;
  quantity: number;
}

interface CartAreaProps {
  cart: CartItem[];
  totalPrice: number;
  updateQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  handleCheckout: () => void;
  isSubmitting: boolean;
}

export function CartArea({
  cart,
  totalPrice,
  updateQty,
  removeFromCart,
  handleCheckout,
  isSubmitting
}: CartAreaProps) {
  return (
    <div className="bg-gray-900/40 border border-gray-800/80 rounded-3xl p-4 flex-1 flex flex-col min-h-220px">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3 px-1">
        Daftar Belanja ({cart.length})
      </h2>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-500">
          <ShoppingBag className="w-10 h-10 mb-2 stroke-1" />
          <p className="text-sm font-medium">Keranjang masih kosong</p>
          <p className="text-xs text-gray-600 mt-0.5">Pindai barcode untuk menambahkan barang</p>
        </div>
      ) : (
        <div className="flex-1 space-y-3 overflow-y-auto max-h-240px pr-1">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-gray-950/60 border border-gray-800 p-3 rounded-2xl shadow-inner transition hover:border-gray-700"
            >
              <div className="flex-1 min-w-0 pr-3">
                <p className="font-medium text-white text-sm truncate">{item.name}</p>
                <p className="text-xs text-teal-400">
                  Rp {item.price.toLocaleString("id-ID")}
                </p>
                <p className="text-[10px] text-gray-500">Stok sisa: {item.stock}</p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-gray-900 border border-gray-850 rounded-xl">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 text-sm font-semibold min-w-20px text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total & Checkout Button */}
      {cart.length > 0 && (
        <div className="border-t border-gray-800 mt-4 pt-4 space-y-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-sm text-gray-400">Total Harga:</span>
            <span className="text-lg font-bold text-teal-400">
              Rp {totalPrice.toLocaleString("id-ID")}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={isSubmitting}
            className="w-full py-3.5 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold rounded-2xl shadow-lg transition active:scale-95 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Simpan Transaksi Keluar</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
