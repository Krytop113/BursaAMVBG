"use client";

import React, { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import type { User } from "./types";

interface DeleteUserModalProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteUserModal({
  user,
  onClose,
  onSuccess,
}: DeleteUserModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/user/${user.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal menghapus user.");
        return;
      }

      onSuccess();
      onClose();
    } catch {
      setError("Gagal terhubung ke server.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-500/10 rounded-xl border border-red-500/20">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Hapus User</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>

        {/* Warning */}
        <div className="p-3.5 bg-red-500/5 border border-red-500/15 rounded-xl">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Apakah Anda yakin ingin menghapus user{" "}
            <span className="font-semibold text-gray-900 dark:text-white">"{user.username}"</span>?
          </p>

          <div className="flex items-center gap-1.5 mt-2 text-xs text-red-400/80">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Akses user ini ke sistem akan segera dicabut.</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Batal
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-400 disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Ya, Hapus
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
