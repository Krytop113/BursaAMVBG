"use client";

import React, { useState } from "react";
import {
  X,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ArrowRightLeft,
} from "lucide-react";
import type { Product } from "./types";
import {
  validateTransactionForm,
  type TransactionFieldErrors,
} from "@/validators/transactionValidator";

interface AddTransactionModalProps {
  products: Product[];
  onClose: () => void;
  onSuccess: () => void;
}

const INITIAL_FORM = {
  productId: "",
  type: "IN" as "IN" | "OUT",
  quantity: "",
  note: "",
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-400 mt-1">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {message}
    </p>
  );
}

function inputCls(hasError: boolean, extra = "") {
  return `w-full px-3.5 py-2.5 bg-slate-950 border rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-1 transition-all ${extra} ${
    hasError
      ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
      : "border-gray-700 focus:border-teal-500 focus:ring-teal-500/30"
  }`;
}

export default function AddTransactionModal({
  products,
  onClose,
  onSuccess,
}: AddTransactionModalProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<TransactionFieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name as keyof TransactionFieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) setServerError("");
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const errors = validateTransactionForm({
      productId: form.productId,
      type: form.type,
      quantity: Number(form.quantity),
      note: form.note,
    });
    const field = e.target.name as keyof TransactionFieldErrors;
    setFieldErrors((prev) => ({ ...prev, [field]: errors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const errors = validateTransactionForm({
      productId: form.productId,
      type: form.type,
      quantity: Number(form.quantity),
      note: form.note,
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: form.productId,
          type: form.type,
          quantity: Number(form.quantity),
          note: form.note,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        setServerError(data.error || "Terjadi kesalahan, silakan coba lagi.");
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

  const selectedProductInfo = products.find((p) => p.id === form.productId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-gray-800 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 rounded-lg border border-teal-500/20">
              <ArrowRightLeft className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Catat Transaksi Baru
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Pilih produk dan tentukan tipe transaksi masuk atau keluar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-14 flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-teal-500/10 rounded-full border border-teal-500/20 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-teal-400" />
            </div>
            <p className="text-white font-semibold text-lg">
              Transaksi Berhasil Dicatat!
            </p>
            <p className="text-gray-500 text-sm">
              Memuat ulang daftar transaksi...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
          >
            {/* Global server error */}
            {serverError && (
              <div className="flex items-center gap-2.5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Product Dropdown */}
            <div className="space-y-1">
              <label htmlFor="productId" className="text-xs font-semibold text-gray-400">
                Pilih Produk
              </label>
              <div className="relative">
                <select
                  id="productId"
                  name="productId"
                  value={form.productId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputCls(!!fieldErrors.productId, "appearance-none pr-10 cursor-pointer")}
                >
                  <option value="" disabled>-- Pilih Produk --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.name} ({p.qrCode}) - Stok: {p.stock}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              <FieldError message={fieldErrors.productId} />
              {selectedProductInfo && (
                <p className="text-[11px] text-teal-400 mt-1 pl-1">
                  Stok saat ini: {selectedProductInfo.stock} unit
                </p>
              )}
            </div>

            {/* Type Switcher */}
            <div className="space-y-1">
              <label htmlFor="type" className="text-xs font-semibold text-gray-400">
                Tipe Transaksi
              </label>
              <div className="relative">
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputCls(!!fieldErrors.type, "appearance-none pr-10 cursor-pointer")}
                >
                  <option value="IN" className="bg-slate-900 text-white">Masuk (IN) - Menambah Stok</option>
                  <option value="OUT" className="bg-slate-900 text-white">Keluar (OUT) - Mengurangi Stok</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              <FieldError message={fieldErrors.type} />
            </div>

            {/* Quantity */}
            <div className="space-y-1">
              <label htmlFor="quantity" className="text-xs font-semibold text-gray-400">
                Jumlah Barang
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                placeholder="Masukkan jumlah..."
                value={form.quantity}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputCls(!!fieldErrors.quantity)}
              />
              <FieldError message={fieldErrors.quantity} />
            </div>

            {/* Note */}
            <div className="space-y-1">
              <label htmlFor="note" className="text-xs font-semibold text-gray-400">
                Catatan (Opsional)
              </label>
              <textarea
                id="note"
                name="note"
                rows={3}
                placeholder="Contoh: Stok masuk dari supplier A, atau Penjualan pelanggan..."
                value={form.note}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputCls(!!fieldErrors.note, "resize-none")}
              />
              <FieldError message={fieldErrors.note} />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-800 mt-6 justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white bg-transparent hover:bg-gray-800 rounded-lg transition-colors border border-transparent hover:border-gray-700 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 bg-teal-500 text-slate-950 font-bold px-4 py-2 rounded-lg hover:bg-teal-400 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Simpan Transaksi
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
