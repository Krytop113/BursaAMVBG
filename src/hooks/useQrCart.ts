"use client";

import { useState } from "react";
import type { CartItem } from "@/components/qr/CartArea";

interface UseQrCartProps {
  setScanError: (err: string | null) => void;
  setTxSuccess: (msg: string | null) => void;
  stopScanner: () => void;
}

export function useQrCart({
  setScanError,
  setTxSuccess,
  stopScanner,
}: UseQrCartProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            if (nextQty > item.stock) {
              setScanError(`Stok maksimal untuk "${item.name}" adalah ${item.stock}`);
              return item;
            }
            if (nextQty < 1) return null;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    setScanError(null);
    setTxSuccess(null);

    try {
      for (const item of cart) {
        const response = await fetch("/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: item.id,
            type: "OUT",
            quantity: item.quantity,
            note: "Penjualan via QR Scanner HP",
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || `Gagal menyimpan transaksi untuk ${item.name}`);
        }
      }

      setTxSuccess("Transaksi berhasil disimpan! Stok inventori telah dikurangi.");
      setCart([]);
      stopScanner();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memproses transaksi keluar.";
      setScanError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    cart,
    setCart,
    isSubmitting,
    updateQty,
    removeFromCart,
    totalPrice,
    handleCheckout,
  };
}
