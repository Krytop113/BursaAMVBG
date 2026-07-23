"use client";

import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import type { Product } from "@/components/products/types";

interface UseQrScannerProps {
  scannerId: string;
  products: Product[];
  onScanSuccess: (decodedText: string) => void;
}

export function useQrScanner({
  scannerId,
  products,
  onScanSuccess,
}: UseQrScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

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
            const size = Math.round(Math.min(width, height) * 0.9);
            return { width: size, height: size };
          }
        },
        (decodedText) => {
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          console.warn("QR Scan Error:", errorMessage);
        }
      );
      setScanning(true);
    } catch (err: unknown) {
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

  const scanFile = async (file: File) => {
    setScanError(null);
    setTxSuccess(null);
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerId);
      }

      if (html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop();
        setScanning(false);
      }

      const decodedText = await html5QrCodeRef.current.scanFile(file, true);
      if (decodedText) {
        onScanSuccess(decodedText);
      }
    } catch (err: unknown) {
      console.error("Gagal membaca QR dari file:", err);
      setScanError("QR Code tidak ditemukan atau tidak dapat dibaca dari gambar yang diunggah.");
    }
  };

  return {
    scanning,
    scanError,
    setScanError,
    txSuccess,
    setTxSuccess,
    startScanner,
    stopScanner,
    scanFile,
  };
}
