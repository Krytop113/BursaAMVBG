"use client";

import React, { useState } from "react";
import { BookOpen, X, Plus, Package } from "lucide-react";
import type { Product, Category } from "@/types";

import { CatalogFilterBar } from "./CatalogFilterBar";

interface CatalogModalProps {
  products: Product[];
  categories: Category[];
  onSelectProduct: (qrCode: string) => void;
  onClose: () => void;
}

export function CatalogModal({
  products,
  categories,
  onSelectProduct,
  onClose,
}: CatalogModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.qrCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategoryId === null || product.categoryId === selectedCategoryId;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-lg max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-gray-900 dark:text-white transform transition-all duration-300 animate-in slide-in-from-bottom">
        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-teal-500/10 rounded-xl text-teal-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-slate-100 leading-tight">
                Kamus / Katalog Produk
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Pilih barang untuk dimasukkan ke keranjang kasir
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <CatalogFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={setSelectedCategoryId}
          />
        </div>

        {/* List Grid Produk */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[60vh]">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400 dark:text-gray-500">
              <Package className="w-12 h-12 mb-2 stroke-1" />
              <p className="text-sm font-medium">Produk tidak ditemukan</p>
              <p className="text-xs mt-1">Coba gunakan kata kunci pencarian lain.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col justify-between bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-xs hover:border-teal-500/40 transition group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 truncate max-w-[80px]">
                        {product.qrCode}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                          product.stock <= 5
                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                            : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        }`}
                      >
                        Stok: {product.stock}
                      </span>
                    </div>

                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 leading-snug">
                      {product.name}
                    </h4>

                    <p className="text-xs font-bold text-teal-600 dark:text-teal-400">
                      Rp {Number(product.price).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onSelectProduct(product.qrCode);
                      onClose();
                    }}
                    disabled={product.stock <= 0}
                    className="mt-3 w-full py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
