"use client";

import React, { useRef } from "react";
import { QrCode, Loader2, Upload } from "lucide-react";

interface ScannerAreaProps {
  scannerId: string;
  scanning: boolean;
  isLoadingProducts: boolean;
  startScanner: () => void;
  stopScanner: () => void;
  onFileUpload: (file: File) => void;
}

export function ScannerArea({
  scannerId,
  scanning,
  isLoadingProducts,
  startScanner,
  stopScanner,
  onFileUpload,
}: ScannerAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      e.target.value = "";
    }
  };

  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-950 border border-slate-200 dark:border-gray-800 rounded-3xl shadow-2xl flex flex-col items-center p-4 w-full">
      {/* Input File Tersembunyi */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Scanner Wrapper */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 transition-all duration-300">
        {/* Container Murni untuk html5-qrcode */}
        <div id={scannerId} className="w-full h-full" />

        {/* Overlay Status Kamera */}
        {!scanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-100 dark:bg-gray-900 z-10">
            <QrCode className="w-16 h-16 text-teal-500 animate-pulse" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Menginisialisasi Kamera / Scan QR</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-[240px]">
                Gunakan kamera belakang atau unggah foto/gambar QR Code untuk memindai barang.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tombol Kontrol Kamera & Upload */}
      <div className="mt-4 w-full flex flex-col sm:flex-row gap-2">
        {!scanning ? (
          <button
            onClick={startScanner}
            disabled={isLoadingProducts}
            className="flex-1 py-3.5 bg-linear-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-semibold rounded-2xl shadow-lg transition active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoadingProducts ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memuat Produk...</span>
              </>
            ) : (
              <span>Aktifkan Kamera</span>
            )}
          </button>
        ) : (
          <button
            onClick={stopScanner}
            className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 border border-red-500/30 font-semibold rounded-2xl transition"
          >
            Matikan Kamera
          </button>
        )}

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoadingProducts}
          className="flex-1 py-3.5 bg-slate-100 dark:bg-gray-900 hover:bg-slate-200 dark:hover:bg-gray-800 text-teal-600 dark:text-teal-400 border border-teal-500/30 font-semibold rounded-2xl shadow-lg transition active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
        >
          <Upload className="w-5 h-5 text-teal-500 dark:text-teal-400" />
          <span>Upload Gambar QR</span>
        </button>
      </div>
    </div>
  );
}
