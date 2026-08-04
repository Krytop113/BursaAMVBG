"use client";

import React, { useState, useEffect } from "react";
import { Trash2, AlertCircle, Edit2, Eye } from "lucide-react";
import type { User } from "@/types";


interface UserTableProps {
  users: User[];
  filteredUsers: User[];
  isLoading: boolean;
  searchQuery: string;
  selectedRole: string;
  onResetFilter: () => void;
  onEditClick: (user: User) => void;
  onDeleteClick: (user: User) => void;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-200 dark:border-gray-800/50">
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-slate-200 dark:bg-gray-800/70 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

function ActionButtons({
  user,
  onEditClick,
  onDeleteClick,
}: {
  user: User;
  onEditClick: (user: User) => void;
  onDeleteClick: (user: User) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        title="Edit User"
        onClick={() => onEditClick(user)}
        className="p-1.5 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-md text-gray-500 hover:text-teal-500 dark:hover:text-teal-400 transition-colors"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      <button
        title="Hapus User"
        onClick={() => onDeleteClick(user)}
        className="p-1.5 hover:bg-red-500/10 rounded-md text-gray-500 hover:text-red-400 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export function UserTable({
  users,
  filteredUsers,
  isLoading,
  searchQuery,
  selectedRole,
  onResetFilter,
  onEditClick,
  onDeleteClick,
}: UserTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredUsers.length]);

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const isEmpty = !isLoading && filteredUsers.length === 0;
  const hasActiveFilter = searchQuery.length > 0 || selectedRole !== "Semua";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden">
      {/* Loading state */}
      {isLoading ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-950/40 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                <th className="px-4 py-3.5 w-20">#</th>
                <th className="px-4 py-3.5">Nama User</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5 w-40 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(4)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : isEmpty ? (
        /* Empty state */
        <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
          <div className="p-4 bg-slate-100 dark:bg-gray-800/40 rounded-full">
            <AlertCircle className="w-10 h-10 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            User Tidak Ditemukan
          </h3>
          <p className="text-gray-500 text-sm max-w-sm">
            {hasActiveFilter
              ? "Coba gunakan kata kunci lain atau pilih role berbeda."
              : 'Belum ada user. Klik tombol "Tambah User Baru" untuk memulai.'}
          </p>
          {hasActiveFilter && (
            <button
              onClick={onResetFilter}
              className="mt-1 text-teal-400 text-sm hover:underline"
            >
              Reset semua filter
            </button>
          )}
        </div>
      ) : (
        /* Data table */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-950/40 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                <th className="px-4 py-3.5 w-20">#</th>
                <th className="px-4 py-3.5">Nama User</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5 w-40 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800/50">
              {paginatedUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-4 py-3.5 text-gray-400 dark:text-gray-600 text-xs">
                    {startIndex + index + 1}
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-gray-900 dark:text-white group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                      {user.username}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="text-gray-500 dark:text-gray-400">{user.email}</span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-md text-xs font-semibold border border-blue-500/20">
                      {user.role || "Tidak ada role"}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <ActionButtons user={user} onEditClick={onEditClick} onDeleteClick={onDeleteClick} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Table footer with Pagination */}
      {!isLoading && totalItems > 0 && (
        <div className="px-4 py-3 border-t border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>
            Menampilkan <span className="text-gray-300 font-medium">{totalItems > 0 ? startIndex + 1 : 0}</span>-
            <span className="text-gray-300 font-medium">{endIndex}</span> dari{" "}
            <span className="text-gray-300 font-medium">{totalItems}</span> user
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

          {selectedRole !== "Semua" && (
            <button
              onClick={onResetFilter}
              className="text-teal-400 hover:underline"
            >
              Reset filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
