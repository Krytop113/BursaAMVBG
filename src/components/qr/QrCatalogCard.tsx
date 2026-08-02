"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Maximize2, Tag } from "lucide-react";
import type { Product } from "@/components/products/types";

interface QrCatalogCardProps {
  product: Product;
  onOpenQrModal: (product: Product) => void;
}

export function QrCatalogCard({ product, onOpenQrModal }: QrCatalogCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, product.qrCode, {
      width: 140,
      margin: 1,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    }).then(() => setReady(true));
  }, [product.qrCode]);

  return (
    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-4 shadow-lg hover:shadow-xl hover:border-teal-500/30 transition flex flex-col justify-between space-y-3">
      {/* Visual QR Code Card */}
      <div className="relative group bg-slate-50 dark:bg-gray-950 p-3 rounded-2xl border border-slate-200 dark:border-gray-800 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className={`block transition-opacity duration-300 rounded-lg ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
        {!ready && (
          <div className="w-[140px] h-[140px] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-teal-500/40 border-t-teal-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Hover Overlay Button */}
        <button
          onClick={() => onOpenQrModal(product)}
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white rounded-2xl space-x-1.5 font-semibold text-xs"
        >
          <Maximize2 className="w-4 h-4" />
          <span>Perbesar</span>
        </button>
      </div>

      {/* Info Produk */}
      <div className="space-y-1 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 truncate">
            {product.qrCode}
          </span>
          {product.categoryName && (
            <span className="text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full font-medium flex items-center space-x-1">
              <Tag className="w-2.5 h-2.5" />
              <span>{product.categoryName}</span>
            </span>
          )}
        </div>

        <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-1">
          {product.name}
        </h3>

        <div className="flex justify-between items-center pt-1">
          <p className="text-sm font-extrabold text-teal-600 dark:text-teal-400">
            Rp {Number(product.price).toLocaleString("id-ID")}
          </p>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
              product.stock <= 5
                ? "bg-red-500/10 text-red-500"
                : "bg-slate-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            Stok: {product.stock}
          </span>
        </div>
      </div>

      {/* Tombol Perbesar Modal */}
      <button
        onClick={() => onOpenQrModal(product)}
        className="w-full py-2 bg-slate-100 dark:bg-gray-800 hover:bg-teal-500 hover:text-white text-gray-700 dark:text-gray-300 font-semibold text-xs rounded-xl transition flex items-center justify-center space-x-1.5"
      >
        <Maximize2 className="w-3.5 h-3.5" />
        <span>Tampilkan QR Fullscreen</span>
      </button>
    </div>
  );
}
