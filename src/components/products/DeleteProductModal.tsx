"use client";

import React, { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import type { Product } from "./types";

interface DeleteProductModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteProductModal({
  product,
  onClose,
  onSuccess,
}: DeleteProductModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal menghapus produk.");
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

      {/* Panel */}
      <div className="relative w-full max-w-sm bg-slate-900 border border-gray-800 rounded-2xl shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-500/10 rounded-xl border border-red-500/20">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Hapus Produk</h3>
            <p className="text-xs text-gray-500">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>

        {/* Warning message */}
        <div className="p-3.5 bg-red-500/5 border border-red-500/15 rounded-xl">
          <p className="text-sm text-gray-300 leading-relaxed">
            Apakah Anda yakin ingin menghapus produk{" "}
            <span className="font-semibold text-white">
              &quot;{product.name}&quot;
            </span>
            ?
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-red-400/80">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Semua data terkait produk ini juga akan ikut terhapus.</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
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
