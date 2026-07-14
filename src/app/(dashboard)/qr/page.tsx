"use client";

import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useProducts } from "@/hooks/useProducts";
import { AlertCircle, CheckCircle } from "lucide-react";
import { ScannerHeader } from "@/components/qr/ScannerHeader";
import { ScannerArea } from "@/components/qr/ScannerArea";
import { CartArea, CartItem } from "@/components/qr/CartArea";

export default function QrScannerPage() {
  const { data: productsData, isLoading: isLoadingProducts } = useProducts();
  const products = productsData?.products ?? [];

  const [cart, setCart] = useState<CartItem[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerId = "mobile-qr-reader";

  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    if (isDesktop) {
      window.location.href = "/";
      return;
    }

    if (products.length > 0) {
      startScanner();
    }
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(console.error);
      }
    };
  }, [products]);

  const startScanner = async () => {
    setScanError(null);
    setTxSuccess(null);
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerId);
      }

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 15,
          qrbox: (width, height) => {
            const boxWidth = Math.min(width * 0.85, 400);
            const boxHeight = Math.min(height * 0.35, 200);
            return { width: boxWidth, height: boxHeight };
          }
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          console.warn("QR Scan Error:", errorMessage);
        }
      );
      setScanning(true);
    } catch (err: any) {
      console.error("Gagal menyalakan kamera:", err);
      setScanError("Akses kamera ditolak atau perangkat tidak memiliki kamera belakang.");
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        setScanning(false);
      } catch (err) {
        console.error("Gagal mematikan kamera:", err);
      }
    }
  };

  const handleScanSuccess = (code: string) => {
    const product = products.find(
      (p) => p.qrCode.toLowerCase() === code.trim().toLowerCase()
    );

    if (!product) {
      setScanError(`Produk dengan Barcode/QR "${code}" tidak ditemukan!`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          setScanError(`Stok tidak mencukupi untuk menambah "${product.name}"`);
          return prev;
        }
        setScanError(null);
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        if (product.stock < 1) {
          setScanError(`Stok "${product.name}" kosong!`);
          return prev;
        }
        setScanError(null);
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            stock: product.stock,
            qrCode: product.qrCode,
            quantity: 1,
          },
        ];
      }
    });
  };

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
    } catch (err: any) {
      setScanError(err.message || "Gagal memproses transaksi keluar.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    </div>
  );
}
