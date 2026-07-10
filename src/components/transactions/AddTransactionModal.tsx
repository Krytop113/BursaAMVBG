"use client";

import React, { useState } from "react";
import { Plus, ArrowRightLeft } from "lucide-react";
import type { Product } from "./types";
import { validateTransactionForm, type TransactionFieldErrors } from "@/validators/transactionValidator";
import { Modal, FieldError, inputCls, Button } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

export default function AddTransactionModal({
  products,
  onClose,
  onSuccess,
}: AddTransactionModalProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<TransactionFieldErrors>({});
  const [serverError, setServerError] = useState("");
  const queryClient = useQueryClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name as keyof TransactionFieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) setServerError("");
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  const addTransactionMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        throw new Error(data.error || "Gagal mencatat transaksi.");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      onSuccess();
      onClose();
    },
    onError: (err: any) => {
      setServerError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
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

    addTransactionMutation.mutate({
      productId: form.productId,
      type: form.type,
      quantity: Number(form.quantity),
      note: form.note,
    });
  };

  const selectedProductInfo = products.find((p) => p.id === form.productId);

  return (
    <Modal
      title="Catat Transaksi Baru"
      icon={<ArrowRightLeft className="w-5 h-5" />}
      subtitle="Pilih produk dan tentukan tipe transaksi masuk atau keluar"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
        {serverError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {serverError}
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="productId" className="text-xs font-semibold text-gray-400">
            Pilih Produk *
          </label>
          <select
            id="productId"
            name="productId"
            value={form.productId}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputCls(!!fieldErrors.productId)}
          >
            <option value="" disabled>-- Pilih Produk --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                {p.name} ({p.qrCode}) - Stok: {p.stock}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.productId} />
          {selectedProductInfo && (
            <p className="text-[11px] text-teal-400 mt-1 pl-1">
              Stok saat ini: {selectedProductInfo.stock} unit
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="type" className="text-xs font-semibold text-gray-400">
            Tipe Transaksi *
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputCls(!!fieldErrors.type)}
          >
            <option value="IN" className="bg-slate-900 text-white">Masuk (IN) - Menambah Stok</option>
            <option value="OUT" className="bg-slate-900 text-white">Keluar (OUT) - Mengurangi Stok</option>
          </select>
          <FieldError message={fieldErrors.type} />
        </div>

        <div className="space-y-1">
          <label htmlFor="quantity" className="text-xs font-semibold text-gray-400">
            Jumlah Barang *
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

        <div className="space-y-1">
          <label htmlFor="note" className="text-xs font-semibold text-gray-400">
            Catatan (Opsional)
          </label>
          <textarea
            id="note"
            name="note"
            rows={3}
            placeholder="Contoh: Stok masuk dari supplier..."
            value={form.note}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputCls(!!fieldErrors.note, "resize-none")}
          />
          <FieldError message={fieldErrors.note} />
        </div>

        <div className="flex gap-3 pt-4 justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            isLoading={addTransactionMutation.isPending}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Simpan Transaksi
          </Button>
        </div>
      </form>
    </Modal>
  );
}
