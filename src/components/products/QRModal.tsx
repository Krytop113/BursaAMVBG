"use client";

import React, { useEffect, useRef, useState } from "react";
import { QrCode, Download, X } from "lucide-react";
import QRCode from "qrcode";

interface QRModalProps {
  product: { name: string; qrCode: string };
  onClose: () => void;
}

export function QRModal({ product, onClose }: QRModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  // Tutup dengan Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Generate QR ke canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, product.qrCode, {
      width: 280,
      margin: 2,
      color: {
        dark: "#0f172a",  // slate-900 — warna modul QR
        light: "#f8fafc", // slate-50  — background QR
      },
      errorCorrectionLevel: "H",
    }).then(() => setReady(true));
  }, [product.qrCode]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Buat canvas baru dengan padding + label nama produk
    const padding = 24;
    const labelH = 52;
    const out = document.createElement("canvas");
    out.width = canvas.width + padding * 2;
    out.height = canvas.height + padding * 2 + labelH;

    const ctx = out.getContext("2d")!;

    // Background putih bersih
    ctx.fillStyle = "#ffffff";
    ctx.roundRect(0, 0, out.width, out.height, 16);
    ctx.fill();

    // Tempel QR
    ctx.drawImage(canvas, padding, padding);

    // Label nama produk
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 14px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(product.name, out.width / 2, canvas.height + padding + 22);

    // Label kode
    ctx.fillStyle = "#64748b";
    ctx.font = "12px monospace";
    ctx.fillText(product.qrCode, out.width / 2, canvas.height + padding + 42);

    // Download
    const link = document.createElement("a");
    link.download = `QR_${product.qrCode}.png`;
    link.href = out.toDataURL("image/png");
    link.click();
  };

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      {/* Panel */}
      <div
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-200 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-500/10 border border-teal-500/20 rounded-lg">
              <QrCode className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                QR Code Produk
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono">
                {product.qrCode}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
            title="Tutup (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Canvas area */}
        <div className="flex flex-col items-center gap-4 px-6 py-6">
          {/* White card untuk QR */}
          <div className="p-4 bg-white rounded-xl shadow-inner">
            <canvas
              ref={canvasRef}
              className={`block transition-opacity duration-300 ${
                ready ? "opacity-100" : "opacity-0"
              }`}
            />
            {!ready && (
              <div className="w-280px h-280px flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-teal-500/40 border-t-teal-500 rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Nama produk */}
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center leading-snug max-w-240px">
            {product.name}
          </p>

          {/* Tombol Download */}
          <button
            onClick={handleDownload}
            disabled={!ready}
            className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold text-sm px-4 py-2.5 rounded-lg transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            Download PNG
          </button>

          <p className="text-xs text-gray-600 text-center">
            QR code berisi teks: <span className="font-mono text-gray-500">{product.qrCode}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
