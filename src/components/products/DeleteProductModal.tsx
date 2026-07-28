"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import type { Product } from "./types";
import { Modal, Button } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus produk.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      onSuccess();
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  return (
    <Modal
      title="Hapus Produk"
      icon={<Trash2 className="w-5 h-5" />}
      accent="red"
      size="sm"
      subtitle="Tindakan ini tidak dapat dibatalkan"
      onClose={onClose}
    >
      <div className="p-6 space-y-5">
        <div className="p-3.5 bg-red-500/5 border border-red-500/15 rounded-xl text-sm text-gray-700 dark:text-gray-300">
          Apakah Anda yakin ingin menghapus produk{" "}
          <span className="font-semibold text-gray-900 dark:text-white">&quot;{product.name}&quot;</span>?
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteMutation.mutate()}
            isLoading={deleteMutation.isPending}
            className="flex-1"
          >
            Ya, Hapus
          </Button>
        </div>
      </div>
    </Modal>
  );
}
