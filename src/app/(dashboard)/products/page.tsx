"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ProductPageHeader,
  ProductFilters,
  ProductTable,
  AddProductModal,
  DeleteProductModal,
} from "@/components/products";
import type { Product, Category } from "@/components/products";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      const [prodData, catData] = await Promise.all([
        prodRes.json(),
        catRes.json(),
      ]);
      if (prodRes.ok) setProducts(prodData.products ?? []);
      if (catRes.ok) setCategories(catData.categories ?? []);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProducts = products.filter((p) => {
    const matchesCat =
      selectedCategory === "Semua" || p.categoryName === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.qrCode.toLowerCase().includes(q) ||
      String(p.id).includes(q);
    return matchesCat && matchesSearch;
  });

  const handleResetFilter = () => {
    setSelectedCategory("Semua");
    setSearchQuery("");
  };

  return (
    <>
      <div className="space-y-6">
        <ProductPageHeader onAddClick={() => setShowAddModal(true)} />

        <ProductFilters
          categories={categories}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
        />

        <ProductTable
          products={products}
          filteredProducts={filteredProducts}
          isLoading={isLoading}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onResetFilter={handleResetFilter}
          onDeleteClick={setDeleteTarget}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddProductModal
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchData}
        />
      )}

      {deleteTarget && (
        <DeleteProductModal
          product={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={fetchData}
        />
      )}
    </>
  );
}
