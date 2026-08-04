"use client";

import React from "react";
import { Plus } from "lucide-react";

interface RolePageHeaderProps {
  onAddClick: () => void;
}

export function RolePageHeader({
  onAddClick,
}: RolePageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
          Kelola role
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Kelola role
        </p>
      </div>
      <button
        id="btn-tambah-role"
        onClick={onAddClick}
        className="flex items-center justify-center gap-2 bg-teal-500 text-slate-950 font-semibold px-4 py-2.5 rounded-lg hover:bg-teal-400 active:scale-95 transition-all duration-200 shadow-lg shadow-teal-500/20 text-sm"
      >
        <Plus className="w-5 h-5" />
        Tambah role Baru
      </button>
    </div>
  );
}
