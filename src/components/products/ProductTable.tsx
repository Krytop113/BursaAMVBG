"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Edit2,
  Trash2,
  AlertCircle,
  Tag,
  Package,
  ZoomIn,
  X,
  ZoomOut,
  RotateCcw,
  QrCode,
} from "lucide-react";
import type { Product } from "./types";
import { QRModal } from "./QRModal";

function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale((prev) => {
      const next = prev - e.deltaY * 0.001;
      return Math.min(Math.max(next, 0.5), 4);
    });
  };

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      {/* Toolbar */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setScale((s) => Math.min(s + 0.25, 4));
          }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          title="Perbesar"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setScale((s) => Math.max(s - 0.25, 0.5));
          }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          title="Perkecil"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setScale(1);
          }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          title="Reset Zoom"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-red-500/60 rounded-lg text-white transition-colors"
          title="Tutup (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Zoom hint */}
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/40 z-10 select-none">
        Scroll untuk zoom · Klik di luar untuk tutup · Esc untuk keluar
      </p>

      {/* Image */}
      <div
        className="relative z-10 max-w-[90vw] max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
      >
        <img
          src={src}
          alt={alt}
          style={{
            transform: `scale(${scale})`,
            transition: "transform 0.15s ease",
            transformOrigin: "center center",
          }}
          className="max-w-[88vw] max-h-[82vh] object-contain rounded-xl shadow-2xl shadow-black/60 block"
          draggable={false}
        />
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-10 right-4 text-xs text-white/40 z-10 tabular-nums">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
}

interface ProductTableProps {
  products: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  searchQuery: string;
  selectedCategory: string;
  onResetFilter: () => void;
  onEditClick: (product: Product) => void;
  onDeleteClick: (product: Product) => void;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-200 dark:border-gray-800/50">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-slate-200 dark:bg-gray-800/70 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

function StatusBadge({ status, stock }: { status: string; stock: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex items-center w-fit px-2 py-0.5 rounded-full text-xs font-semibold border ${status === "Aktif"
          ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
          : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
      >
        {status}
      </span>
      <span className="text-[11px] text-gray-500 pl-0.5">Stok: {stock}</span>
    </div>
  );
}

function ActionButtons({
  product,
  onEditClick,
  onDeleteClick,
  onQRClick,
}: {
  product: Product;
  onEditClick: (p: Product) => void;
  onDeleteClick: (p: Product) => void;
  onQRClick: (p: Product) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-1">
      <button
        title="Lihat QR Code"
        onClick={() => onQRClick(product)}
        className="p-1.5 hover:bg-teal-500/10 rounded-md text-gray-500 hover:text-teal-400 transition-colors"
      >
        <QrCode className="w-4 h-4" />
      </button>
      <button
        title="Edit Produk"
        onClick={() => onEditClick(product)}
        className="p-1.5 hover:bg-gray-800/10 rounded-md text-gray-500 hover:text-blue-400 transition-colors"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        title="Hapus Produk"
        onClick={() => onDeleteClick(product)}
        className="p-1.5 hover:bg-red-500/10 rounded-md text-gray-500 hover:text-red-400 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ProductTable({
  filteredProducts,
  isLoading,
  searchQuery,
  selectedCategory,
  onResetFilter,
  onEditClick,
  onDeleteClick,
}: ProductTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts.length]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const isEmpty = !isLoading && filteredProducts.length === 0;
  const hasActiveFilter =
    searchQuery.length > 0 || selectedCategory !== "Semua";
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const openLightbox = useCallback(
    (src: string, alt: string) => setLightboxImage({ src, alt }),
    [],
  );
  const closeLightbox = useCallback(() => setLightboxImage(null), []);
  const [qrProduct, setQrProduct] = useState<Product | null>(null);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden">
      {/* Loading state */}
      {isLoading ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-950/40 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Nama Produk</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">Harga Beli</th>
                <th className="px-4 py-3.5">Harga Jual</th>
                <th className="px-4 py-3.5">Stok / Status</th>
                <th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(4)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : isEmpty ? (
        /* Empty state */
        <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
          <div className="p-4 bg-slate-100 dark:bg-gray-800/40 rounded-full">
            <AlertCircle className="w-10 h-10 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Produk Tidak Ditemukan
          </h3>
          <p className="text-gray-500 dark:text-gray-500 text-sm max-w-sm">
            {hasActiveFilter
              ? "Coba gunakan kata kunci lain atau pilih kategori berbeda."
              : 'Belum ada produk. Klik tombol "Tambah Produk Baru" untuk memulai.'}
          </p>
          {hasActiveFilter && (
            <button
              onClick={onResetFilter}
              className="mt-1 text-teal-400 text-sm hover:underline"
            >
              Reset semua filter
            </button>
          )}
        </div>
      ) : (
        /* Data table */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-950/40 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Nama Produk</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">Harga Beli</th>
                <th className="px-4 py-3.5">Harga Jual</th>
                <th className="px-4 py-3.5">Stok / Status</th>
                <th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800/50">
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-4 py-3.5 text-gray-400 dark:text-gray-600 text-xs">
                    {product.id}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <button
                          type="button"
                          title="Klik untuk memperbesar gambar"
                          onClick={() =>
                            openLightbox(product.imageUrl!, product.name)
                          }
                          className="relative w-10 h-10 shrink-0 group/img focus:outline-none"
                          style={{ cursor: "zoom-in" }}
                        >
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-gray-800 transition-all duration-200 group-hover/img:brightness-75 group-hover/img:scale-105"
                          />
                          {/* Overlay magnifier icon */}
                          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-200">
                            <ZoomIn className="w-4 h-4 text-white drop-shadow" />
                          </span>
                        </button>
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-gray-800 rounded-lg flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-600 mt-0.5 line-clamp-1 max-w-xs">
                          {product.description}
                        </div>
                        <button
                          type="button"
                          onClick={() => setQrProduct(product)}
                          className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-mono px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 active:scale-95 transition-all"
                          title="Lihat / Unduh QR Code"
                        >
                          <QrCode className="w-3 h-3" />
                          <span>{product.qrCode}</span>
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md text-xs font-medium">
                      <Tag className="w-3 h-3" />
                      {product.categoryName}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-gray-500 dark:text-gray-400">
                    Rp {product.buyPrice ? product.buyPrice.toLocaleString("id-ID") : "0"}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-white">
                    Rp {product.price.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge
                      status={product.status}
                      stock={product.stock}
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <ActionButtons
                      product={product}
                      onEditClick={onEditClick}
                      onDeleteClick={onDeleteClick}
                      onQRClick={(p) => setQrProduct(p)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Table footer with Pagination */}
      {!isLoading && totalItems > 0 && (
        <div className="px-4 py-3 border-t border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>
            Menampilkan <span className="text-gray-300 font-medium">{totalItems > 0 ? startIndex + 1 : 0}</span>-
            <span className="text-gray-300 font-medium">{endIndex}</span> dari{" "}
            <span className="text-gray-300 font-medium">{totalItems}</span> produk
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-950 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900 disabled:opacity-50 disabled:hover:text-gray-500 disabled:hover:bg-slate-50 transition-colors"
              >
                Sebelumnya
              </button>
              <span className="text-gray-400">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-950 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900 disabled:opacity-50 disabled:hover:text-gray-500 disabled:hover:bg-slate-50 transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          )}

          {selectedCategory !== "Semua" && (
            <button
              onClick={onResetFilter}
              className="text-teal-400 hover:underline"
            >
              Reset filter
            </button>
          )}
        </div>
      )}

      {/* Image Lightbox */}
      {lightboxImage && (
        <ImageLightbox
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          onClose={closeLightbox}
        />
      )}

      {/* QR Code Modal */}
      {qrProduct && (
        <QRModal
          product={qrProduct}
          onClose={() => setQrProduct(null)}
        />
      )}
    </div>
  );
}
