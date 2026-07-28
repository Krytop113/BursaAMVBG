"use client";

import React, { useState } from "react";
import { X, Plus, Loader2, Tag, AlertCircle, CheckCircle2 } from "lucide-react";

interface AddRoleModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddRoleModal({
  onClose,
  onSuccess,
}: AddRoleModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setServerError("");

    if (!name.trim()) {
      setError("Nama role wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Terjadi kesalahan.");
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch {
      setServerError("Gagal terhubung ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 rounded-lg">
              <Tag className="w-5 h-5 text-teal-400" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Tambah Role</h2>

              <p className="text-xs text-gray-500 dark:text-gray-400">Tambahkan role baru</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {success ? (
          <div className="p-12 flex flex-col items-center gap-4">
            <CheckCircle2 className="w-12 h-12 text-teal-400" />
            <p className="text-gray-900 dark:text-white font-semibold">
              Role berhasil ditambahkan
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {serverError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {serverError}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Nama Role
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border text-gray-900 dark:text-white ${
                  error
                    ? "border-red-500"
                    : "border-slate-300 dark:border-gray-700 focus:border-teal-500"
                } focus:outline-none`}
              />

              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold transition-colors"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-teal-500 text-slate-950 font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Simpan
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
