"use client";

import React, { useState } from "react";
import { Package, Save, Edit2 } from "lucide-react";
import type { Product, Category } from "./types";
import { validateProductForm, type ProductFieldErrors } from "@/validators/productValidator";
import { Modal, FieldError, inputCls, Button } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditProductModalProps {
  product: Product;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

export function EditProductModal({
  product,
  categories,
  onClose,
  onSuccess,
}: EditProductModalProps) {
  const [form, setForm] = useState({
    name: product.name,
    description: product.description || "",
    price: String(product.price),
    buyPrice: String(product.buyPrice ?? 0),
    stock: String(product.stock),
    categoryId: String(product.categoryId),
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product.imageUrl || "");
  const [fieldErrors, setFieldErrors] = useState<ProductFieldErrors>({});
  const [serverError, setServerError] = useState("");
  const queryClient = useQueryClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name as keyof ProductFieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) setServerError("");
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const errors = validateProductForm(form);
    const field = e.target.name as keyof ProductFieldErrors;
    setFieldErrors((prev) => ({ ...prev, [field]: errors[field] }));
  };

  const updateProductMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        throw new Error(data.error || "Gagal memperbarui produk.");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      onSuccess();
      onClose();
    },
    onError: (err: Error) => {
      setServerError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const errors = validateProductForm(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("buyPrice", form.buyPrice);
    formData.append("stock", form.stock);
    formData.append("categoryId", form.categoryId);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    updateProductMutation.mutate(formData);
  };

  const errorCount = Object.values(fieldErrors).filter(Boolean).length;

  return (
    <Modal
      title="Edit Produk"
      icon={<Edit2 className="w-5 h-5 text-teal-400" />}
      subtitle={`Ubah informasi produk: ${product.name}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
        {serverError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {serverError}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Produk *</label>
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
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Jelaskan produk Anda secara singkat..."
            rows={3}
            className={inputCls(!!fieldErrors.description, "resize-none")}
          />
          <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
            <FieldError message={fieldErrors.description} />
            <span>{form.description.length}/500</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Harga Beli *</label>
            <input
              type="number"
              name="buyPrice"
              value={form.buyPrice}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0"
              className={inputCls(!!fieldErrors.buyPrice)}
            />
            <FieldError message={fieldErrors.buyPrice} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Harga Jual *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0"
              className={inputCls(!!fieldErrors.price)}
            />
            <FieldError message={fieldErrors.price} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stok *</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0"
              className={inputCls(!!fieldErrors.stock)}
            />
            <FieldError message={fieldErrors.stock} />
          </div>
        </div>

        {/* Gambar Produk */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" />
            Gambar Produk{" "}
            <span className="text-gray-500 font-normal text-xs">(opsional)</span>
          </label>
          <div className="flex gap-4 items-center">
            {imagePreview ? (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-700 shrink-0">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                  }}
                  className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
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
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-800 file:text-gray-300 hover:file:bg-gray-700 cursor-pointer transition-colors"
              />
              <p className="text-xs text-gray-600 mt-1.5">PNG, JPG, WEBP hingga 5MB</p>
            </label>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kategori *</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputCls(!!fieldErrors.categoryId)}
          >
            <option value="" disabled>-- Pilih Kategori --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
                {cat.name}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.categoryId} />
        </div>

        <div className="flex gap-3 pt-4 justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            isLoading={updateProductMutation.isPending}
            leftIcon={errorCount === 0 && <Save className="w-4 h-4" />}
          >
            {errorCount > 0 ? `${errorCount} Perbaikan Dibutuhkan` : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
