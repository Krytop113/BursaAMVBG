"use client";

import { Calendar, Tag, ShoppingBag } from "lucide-react";
import type { Category, Product } from "@/types";


interface InvoiceFiltersProps {
  startDate: string;
  endDate: string;
  categoryId: string;
  productId: string;
  categories: Category[];
  products: Product[];
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onProductChange: (val: string) => void;
}

export function InvoiceFilters({
  startDate,
  endDate,
  categoryId,
  productId,
  categories,
  products,
  onStartDateChange,
  onEndDateChange,
  onCategoryChange,
  onProductChange,
}: InvoiceFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-5 rounded-2xl">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" /> Tanggal Mulai
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-full bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" /> Tanggal Akhir
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-full bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5" /> Kategori Produk
        </label>
        <select
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
        >
          <option value="">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <ShoppingBag className="w-3.5 h-3.5" /> Produk
        </label>
        <select
          value={productId}
          onChange={(e) => onProductChange(e.target.value)}
          className="w-full bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
        >
          <option value="">Semua Produk</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.qrCode})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
