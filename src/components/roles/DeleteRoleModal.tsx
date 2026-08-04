"use client";

import React, { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import type { Role } from "@/types";


interface DeleteRoleModalProps {
  role: Role;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

export function DeleteRoleModal({
  role,
  onClose,
  onSuccess,
}: DeleteRoleModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/roles/${role.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal menghapus role.");
        return;
      }

      await onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Gagal terhubung ke server.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-2.5">
            <Trash2 className="h-5 w-5 text-red-400" />
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Hapus Role</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="rounded-xl border border-red-500/15 bg-red-500/5 p-3.5">
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            Apakah Anda yakin ingin menghapus role{" "}
            <span className="font-semibold text-gray-900 dark:text-white">"{role.name}"</span>?
          </p>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400/80">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>
              Data yang berkaitan dengan role ini mungkin ikut terpengaruh.
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-lg bg-slate-100 dark:bg-gray-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Batal
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Ya, Hapus
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
