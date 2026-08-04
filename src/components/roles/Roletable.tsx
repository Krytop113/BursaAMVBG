"use client";

import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import type { Role } from "@/types";


interface RoleTableProps {
  roles: Role[];
  isLoading: boolean;
  onDeleteClick: (role: Role) => void;
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
  role,
  onDeleteClick,
}: {
  role: Role;
  onDeleteClick: (role: Role) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        title="Hapus Role"
        onClick={() => onDeleteClick(role)}
        className="p-1.5 hover:bg-red-500/10 rounded-md text-gray-500 hover:text-red-400 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export function RoleTable({
  roles,
  isLoading,
  onDeleteClick,
}: RoleTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [roles.length]);

  const totalItems = roles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedRoles = roles.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-950/40 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
              <th className="px-4 py-3.5 w-20">#</th>
              <th className="px-4 py-3.5">Nama Role</th>
              <th className="px-4 py-3.5 w-40 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-gray-800/50">
            {isLoading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : roles.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-10 text-center text-gray-500">
                  Belum ada data role.
                </td>
              </tr>
            ) : (
              paginatedRoles.map((role, index) => (
                <tr
                  key={role.id}
                  className="text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-4 py-3.5">{startIndex + index + 1}</td>

                  <td className="px-4 py-3.5">
                    <span className="font-medium text-gray-900 dark:text-white">{role.name}</span>
                  </td>

                  <td className="px-4 py-3.5">
                    <ActionButtons role={role} onDeleteClick={onDeleteClick} />
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
            <span className="text-gray-300 font-medium">{totalItems}</span> role
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
