"use client";

import React from "react";
import { Search } from "lucide-react";
import type { Category } from "./types";

interface ProductFiltersProps {
  categories: Category[];
  searchQuery: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export default function ProductFilters({
  categories,
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
}: ProductFiltersProps) {
  const categoryLabels = ["Semua", ...categories.map((c) => c.name)];

  return (
    <div className="bg-slate-900 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
      {/* Search */}
      <div className="relative w-full md:w-80">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-500" />
        </span>
        <input
          type="text"
          id="search-produk"
          placeholder="Cari nama, QR Code, atau ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-teal-500 transition-colors"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
        {categoryLabels.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              selectedCategory === cat
                ? "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                : "bg-slate-950 text-gray-400 border border-transparent hover:bg-slate-800 hover:text-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
