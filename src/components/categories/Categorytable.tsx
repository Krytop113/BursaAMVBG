"use client";

import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Eye } from "lucide-react";
import type { Category } from "./types";

interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  onDeleteClick: (category: Category) => void;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-200 dark:border-gray-800/50">
      {[...Array(3)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-slate-200 dark:bg-gray-800/70 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

function ActionButtons({
  category,
  onDeleteClick,
}: {
  category: Category;
  onDeleteClick: (category: Category) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        title="Hapus Kategori"
        onClick={() => onDeleteClick(category)}
        className="p-1.5 hover:bg-gray-800 rounded-md text-gray-400 dark:text-gray-500 hover:text-red-400 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function CategoryTable({
  categories,
  isLoading,
  onDeleteClick,
}: CategoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [categories.length]);

  const totalItems = categories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedCategories = categories.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-950/40 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
              <th className="px-4 py-3.5 w-20">#</th>
              <th className="px-4 py-3.5">Nama Kategori</th>
              <th className="px-4 py-3.5 w-40 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-gray-800/50">
            {isLoading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-10 text-gray-500">
                  Belum ada data kategori.
                </td>
              </tr>
            ) : (
              paginatedCategories.map((category, index) => (
                <tr
                  key={category.id}
                  className="text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-4 py-3.5">{startIndex + index + 1}</td>

                  <td className="px-4 py-3.5">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <ActionButtons
                      category={category}
                      onDeleteClick={onDeleteClick}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && totalItems > 0 && (
        <div className="px-4 py-3 border-t border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>
            Menampilkan <span className="text-gray-300 font-medium">{totalItems > 0 ? startIndex + 1 : 0}</span>-
            <span className="text-gray-300 font-medium">{endIndex}</span> dari{" "}
            <span className="text-gray-300 font-medium">{totalItems}</span> kategori
          </span>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-950 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900 disabled:opacity-50 transition-colors"
              >
                Sebelumnya
              </button>
              <span className="text-gray-400">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-950 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900 disabled:opacity-50 transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
