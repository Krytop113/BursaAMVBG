"use client";

import React, { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { AlertCircle, CheckCircle } from "lucide-react";
import { ScannerHeader } from "@/components/qr/ScannerHeader";
import { ScannerArea } from "@/components/qr/ScannerArea";
import { CartArea } from "@/components/qr/CartArea";
import { ConfirmModal } from "@/components/qr/ConfirmModal";
import { useQrScanner } from "@/hooks/useQrScanner";
import { useQrCart } from "@/hooks/useQrCart";
import type { Product } from "@/components/products/types";

export default function QrScannerPage() {
  const { data: productsData, isLoading: isLoadingProducts } = useProducts();
  const products = productsData?.products ?? [];

  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [confirmQuantity, setConfirmQuantity] = useState<number>(1);

  const scannerId = "mobile-qr-reader";

  const {
    scanning,
    scanError,
    setScanError,
    txSuccess,
    setTxSuccess,
    startScanner,
    stopScanner,
  } = useQrScanner({
    scannerId,
    products,
    onScanSuccess: (decodedText) => handleScanSuccess(decodedText),
  });

  const {
    cart,
    setCart,
    isSubmitting,
    updateQty,
    removeFromCart,
    totalPrice,
    handleCheckout,
  } = useQrCart({
    setScanError,
    setTxSuccess,
    stopScanner,
  });

  const handleScanSuccess = (code: string) => {
    if (scannedProduct) return;

    const product = products.find(
      (p) => p.qrCode.toLowerCase() === code.trim().toLowerCase()
    );

    if (!product) {
      setScanError(`Produk dengan Barcode/QR "${code}" tidak ditemukan!`);
      return;
    }

    const existingCartItem = cart.find((item) => item.id === product.id);
    const existingQty = existingCartItem ? existingCartItem.quantity : 0;
    const maxAddable = product.stock - existingQty;

    if (maxAddable <= 0) {
      setScanError(`Stok tidak mencukupi atau sudah mencapai batas maksimum di keranjang untuk "${product.name}"`);
      return;
    }

    setScanError(null);
    setScannedProduct(product);
    setConfirmQuantity(1);
  };

  const handleConfirmAdd = () => {
    if (!scannedProduct) return;

    const existingCartItem = cart.find((item) => item.id === scannedProduct.id);
    const existingQty = existingCartItem ? existingCartItem.quantity : 0;
    
    if (existingQty + confirmQuantity > scannedProduct.stock) {
      setScanError(`Stok tidak mencukupi untuk menambah "${scannedProduct.name}" sejumlah ${confirmQuantity}`);
      setScannedProduct(null);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === scannedProduct.id);
      if (existing) {
        return prev.map((item) =>
          item.id === scannedProduct.id
            ? { ...item, quantity: item.quantity + confirmQuantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: scannedProduct.id,
            name: scannedProduct.name,
            price: Number(scannedProduct.price),
            stock: scannedProduct.stock,
            qrCode: scannedProduct.qrCode,
            quantity: confirmQuantity,
          },
        ];
      }
    });

    setScannedProduct(null);
    setConfirmQuantity(1);
  };

  const maxAddableQty = scannedProduct
    ? scannedProduct.stock - (cart.find((item) => item.id === scannedProduct.id)?.quantity ?? 0)
    : 1;

  return (
    <div className="flex-1 flex flex-col max-w-lg mx-auto w-full space-y-4">
      {/* Header Premium */}
      <ScannerHeader />

      {/* Area Scanner */}
      <ScannerArea
        scannerId={scannerId}
        scanning={scanning}
        isLoadingProducts={isLoadingProducts}
        startScanner={startScanner}
        stopScanner={stopScanner}
      />

      {/* Notifikasi/Umpan Balik */}
      {scanError && (
        <div className="flex items-start space-x-3 bg-red-950/40 border border-red-500/20 p-4 rounded-2xl text-red-200">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold">Perhatian: </span>
            {scanError}
          </div>
        </div>
      )}

      {txSuccess && (
        <div className="flex items-start space-x-3 bg-emerald-950/40 border border-emerald-500/20 p-4 rounded-2xl text-emerald-200">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold">Sukses: </span>
            {txSuccess}
          </div>
        </div>
      )}

      {/* Keranjang Belanja */}
      <CartArea
        cart={cart}
        totalPrice={totalPrice}
        updateQty={updateQty}
        removeFromCart={removeFromCart}
        handleCheckout={handleCheckout}
        isSubmitting={isSubmitting}
      />

      {/* Modal Konfirmasi Barang */}
      {scannedProduct && (
        <ConfirmModal
          product={scannedProduct}
          quantity={confirmQuantity}
          maxQty={maxAddableQty}
          onClose={() => setScannedProduct(null)}
          onConfirm={handleConfirmAdd}
          onQuantityChange={setConfirmQuantity}
        />
      )}
    </div>
  );
}
