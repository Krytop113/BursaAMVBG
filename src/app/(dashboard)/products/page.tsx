"use client";

import React, { useState } from "react";
import {
  ProductPageHeader,
  ProductFilters,
  ProductTable,
  AddProductModal,
  EditProductModal,
  DeleteProductModal,
} from "@/components/products";
import type { Product } from "@/types";

import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

export default function ProductsPage() {
  const { data: productsData, isLoading: isProductsLoading, refetch: refetchProducts } = useProducts();
  const { data: categoriesData } = useCategories();

  const products = productsData?.products ?? [];
  const categories = categoriesData?.categories ?? [];

  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

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
          isLoading={isProductsLoading}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onResetFilter={handleResetFilter}
          onEditClick={setEditTarget}
          onDeleteClick={setDeleteTarget}
        />
      </div>

      {showAddModal && (
        <AddProductModal
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => refetchProducts()}
        />
      )}

      {editTarget && (
        <EditProductModal
          product={editTarget}
          categories={categories}
          onClose={() => setEditTarget(null)}
          onSuccess={() => refetchProducts()}
        />
      )}

      {deleteTarget && (
        <DeleteProductModal
          product={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={() => refetchProducts()}
        />
      )}
    </>
  );
}

