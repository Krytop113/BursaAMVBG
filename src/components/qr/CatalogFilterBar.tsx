"use client";

import React from "react";
import { Search, Tag } from "lucide-react";
import type { Category, Product } from "@/types";

interface CatalogFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: Category[];
  selectedCategoryId: number | null;
  onCategorySelect: (id: number | null) => void;
}

export function CatalogFilterBar({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategoryId,
  onCategorySelect,
}: CatalogFilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Input Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari produk atau kode QR..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 transition"
        />
      </div>

      {/* Chip Filter Kategori */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => onCategorySelect(null)}
          className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition flex items-center space-x-1.5 ${
            selectedCategoryId === null
              ? "bg-teal-500 text-white shadow-md shadow-teal-500/20"
              : "bg-slate-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-800"
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Semua Kategori</span>
        </button>

        {(categories ?? []).map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategorySelect(cat.id)}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition ${
              selectedCategoryId === cat.id
                ? "bg-teal-500 text-white shadow-md shadow-teal-500/20"
                : "bg-slate-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-800"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
