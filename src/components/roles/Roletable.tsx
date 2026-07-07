"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import type { Role } from "./types";

interface RoleTableProps {
  roles: Role[];
  isLoading: boolean;
  onDeleteClick: (role: Role) => void;
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

export default function RoleTable({
  roles,
  isLoading,
  onDeleteClick,
}: RoleTableProps) {
  return (
    <div className="bg-slate-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-slate-950/40 text-gray-400 font-medium text-xs uppercase tracking-wider">
              <th className="px-4 py-3.5 w-20">#</th>
              <th className="px-4 py-3.5">Nama Role</th>
              <th className="px-4 py-3.5 w-40 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800/50">
            {isLoading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : roles.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-10 text-center text-gray-500">
                  Belum ada data role.
                </td>
              </tr>
            ) : (
              roles.map((role, index) => (
                <tr
                  key={role.id}
                  className="text-gray-300 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-4 py-3.5">{index + 1}</td>

                  <td className="px-4 py-3.5">
                    <span className="font-medium text-white">{role.name}</span>
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
    </div>
  );
}
