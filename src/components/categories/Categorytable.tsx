"use client";

import React from "react";
import { Edit2, Trash2, Eye } from "lucide-react";
import type { Category } from "./types";

interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  onDeleteClick: (category: Category) => void;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-800/50">
      {[...Array(3)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-gray-800/70 rounded animate-pulse" />
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
        className="p-1.5 hover:bg-red-500/10 rounded-md text-gray-500 hover:text-red-400 transition-colors"
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
  return (
    <div className="bg-slate-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-slate-950/40 text-gray-400 font-medium text-xs uppercase tracking-wider">
              <th className="px-4 py-3.5 w-20">#</th>
              <th className="px-4 py-3.5">Nama Kategori</th>
              <th className="px-4 py-3.5 w-40 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800/50">
            {isLoading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-10 text-gray-500">
                  Belum ada data kategori.
                </td>
              </tr>
            ) : (
              categories.map((category, index) => (
                <tr
                  key={category.id}
                  className="text-gray-300 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-4 py-3.5">{index + 1}</td>

                  <td className="px-4 py-3.5">
                    <span className="font-medium text-white">
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
    </div>
  );
}
