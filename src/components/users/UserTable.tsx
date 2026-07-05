"use client";

import React from "react";
import { Trash2, AlertCircle, Edit2, Eye } from "lucide-react";
import type { User } from "./types";

interface UserTableProps {
  users: User[];
  filteredUsers: User[];
  isLoading: boolean;
  searchQuery: string;
  selectedRole: string;
  onResetFilter: () => void;
  onDeleteClick: (user: User) => void;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-800/50">
      {[...Array(5)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-gray-800/70 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

function ActionButtons({
  user,
  onDeleteClick,
}: {
  user: User;
  onDeleteClick: (user: User) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        title="Lihat Detail"
        className="p-1.5 hover:bg-gray-800 rounded-md text-gray-500 hover:text-white transition-colors"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        title="Edit Produk"
        className="p-1.5 hover:bg-gray-800 rounded-md text-gray-500 hover:text-teal-400 transition-colors"
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

export default function UserTable({
  users,
  filteredUsers,
  isLoading,
  searchQuery,
  selectedRole,
  onResetFilter,
  onDeleteClick,
}: UserTableProps) {
  const isEmpty = !isLoading && filteredUsers.length === 0;
  const hasActiveFilter = searchQuery.length > 0 || selectedRole !== "Semua";

  return (
    <div className="bg-slate-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Loading state */}
      {isLoading ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-slate-950/40 text-gray-400 font-medium text-xs uppercase tracking-wider">
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
          <div className="p-4 bg-gray-800/40 rounded-full">
            <AlertCircle className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-base font-semibold text-white">
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
              <tr className="border-b border-gray-800 bg-slate-950/40 text-gray-400 font-medium text-xs uppercase tracking-wider">
                <th className="px-4 py-3.5 w-20">#</th>
                <th className="px-4 py-3.5">Nama User</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5 w-40 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="text-gray-300 hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-4 py-3.5 text-gray-600 text-xs">
                    {index + 1}
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-white group-hover:text-teal-400 transition-colors">
                      {user.username}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="text-gray-400">{user.email}</span>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-md text-xs font-semibold border border-blue-500/20">
                      {user.role || "Tidak ada role"}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <ActionButtons user={user} onDeleteClick={onDeleteClick} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Table footer */}
      {!isLoading && filteredUsers.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
          <span>
            Menampilkan{" "}
            <span className="text-gray-300 font-medium">
              {filteredUsers.length}
            </span>{" "}
            dari{" "}
            <span className="text-gray-300 font-medium">{users.length}</span>{" "}
            user
          </span>
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
