"use client";

import React, { useState } from "react";
import {
  X,
  Package,
  Plus,
  Loader2,
  QrCode,
  Tag,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import type { Category } from "./types";
import {
  validateProductForm,
  type ProductFieldErrors,
} from "@/validators/productValidator";

interface AddProductModalProps {
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

const INITIAL_FORM = {
  name: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
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

export default function AddProductModal({
  categories,
  onClose,
  onSuccess,
}: AddProductModalProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<ProductFieldErrors>({});
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

    if (fieldErrors[name as keyof ProductFieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) setServerError("");
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const errors = validateProductForm(form);
    const field = e.target.name as keyof ProductFieldErrors;
    setFieldErrors((prev) => ({ ...prev, [field]: errors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const errors = validateProductForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("categoryId", form.categoryId);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
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

  const errorCount = Object.values(fieldErrors).filter(Boolean).length;

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
              <Package className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Tambah Produk Baru
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Isi semua informasi produk di bawah ini
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
              Produk Berhasil Ditambahkan!
            </p>
            <p className="text-gray-500 text-sm">
              Memuat ulang daftar produk...
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
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">
                Nama Produk <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Contoh: AMV Background Pack v3"
                className={inputCls(!!fieldErrors.name)}
              />
              <FieldError message={fieldErrors.name} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">
                Deskripsi <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Jelaskan produk Anda secara singkat..."
                rows={3}
                className={inputCls(!!fieldErrors.description, "resize-none")}
              />
              <div className="flex items-center justify-between">
                <FieldError message={fieldErrors.description} />
                <span
                  className={`text-xs ml-auto ${
                    form.description.length > 500
                      ? "text-red-400"
                      : "text-gray-600"
                  }`}
                >
                  {form.description.length}/500
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Harga */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">
                  Harga (Rp) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm pointer-events-none">
                    Rp
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="0"
                    min={0}
                    className={inputCls(!!fieldErrors.price, "pl-9")}
                  />
                </div>
                <FieldError message={fieldErrors.price} />
              </div>

              {/* Stok */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">
                  Stok <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0"
                  min={0}
                  className={inputCls(!!fieldErrors.stock)}
                />
                <FieldError message={fieldErrors.stock} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                Gambar Produk <span className="text-gray-500 font-normal text-xs">(opsional)</span>
              </label>
              <div className="flex gap-4 items-center">
                {imagePreview ? (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-700 shrink-0">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                      }}
                      className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-slate-950 border border-dashed border-gray-700 flex items-center justify-center text-gray-600 shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <span className="sr-only">Pilih file gambar</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-800 file:text-gray-300 hover:file:bg-gray-700 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Kategori <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputCls(
                    !!fieldErrors.categoryId,
                    "appearance-none cursor-pointer"
                  )}
                >
                  <option value="" disabled className="text-gray-500">
                    -- Pilih Kategori --
                  </option>
                  {categories.map((cat) => (
                    <option
                      key={cat.id}
                      value={cat.id}
                      className="bg-slate-900"
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              {categories.length === 0 ? (
                <p className="text-xs text-yellow-500 mt-1">
                  Belum ada kategori tersedia. Tambahkan kategori terlebih
                  dahulu.
                </p>
              ) : (
                <FieldError message={fieldErrors.categoryId} />
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 text-slate-950 rounded-lg text-sm font-semibold hover:bg-teal-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : errorCount > 0 ? (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    {errorCount} error, perbaiki dulu
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Simpan Produk
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
