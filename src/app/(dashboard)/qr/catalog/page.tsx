"use client";

import React, { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { BookOpen, ArrowLeft, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/paths";
import { QrCatalogCard } from "@/components/qr/QrCatalogCard";
import { CatalogFilterBar } from "@/components/qr/CatalogFilterBar";
import { QRModal } from "@/components/products/QRModal";
import type { Product } from "@/components/products/types";

export default function QrCatalogPage() {
  const { data: productsData, isLoading: isLoadingProducts } = useProducts();
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();
  const categories = categoriesData?.categories ?? [];
  
  const products = productsData?.products ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedQrProduct, setSelectedQrProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.qrCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategoryId === null || product.categoryId === selectedCategoryId;

    return matchesSearch && matchesCategory;
  });

  const isLoading = isLoadingProducts || isLoadingCategories;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <Link
            href={ROUTES.dashboard}
            className="p-3 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-2xl text-gray-600 dark:text-gray-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-6 h-6 text-teal-500" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Kamus / Galeri QR Produk
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Direktori visual QR Code seluruh produk untuk referensi dan pemindaian tanpa cetak fisik
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-5 shadow-lg">
        <CatalogFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={setSelectedCategoryId}
        />
      </div>

      {/* Grid Katalog QR */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Memuat Katalog QR Produk...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl text-center">
          <Package className="w-12 h-12 text-gray-400 stroke-1" />
          <p className="text-lg font-semibold text-gray-900 dark:text-white">Tidak ada produk ditemukan</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Coba ubah kata kunci pencarian atau filter kategori Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <QrCatalogCard
              key={product.id}
              product={product}
              onOpenQrModal={setSelectedQrProduct}
            />
          ))}
        </div>
      )}

      {/* Modal QR Code Fullscreen */}
      {selectedQrProduct && (
        <QRModal
          product={{ name: selectedQrProduct.name, qrCode: selectedQrProduct.qrCode }}
          onClose={() => setSelectedQrProduct(null)}
        />
      )}
    </div>
  );
}
