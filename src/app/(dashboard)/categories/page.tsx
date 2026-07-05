"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CategoryPageHeader,
  CategoryTable,
  AddCategoryModal,
  DeleteCategoryModal,
} from "@/components/categories";
import type { Category } from "@/components/categories";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/categories");
      const data = await res.json();

      if (res.ok) {
        setCategories(data.categories ?? []);
      }
    } catch (err) {
      console.error("Gagal mengambil data kategori:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div className="space-y-6">
        <CategoryPageHeader onAddClick={() => setShowAddModal(true)} />

        <CategoryTable
          categories={categories}
          isLoading={isLoading}
          onDeleteClick={setDeleteTarget}
        />
      </div>

      {showAddModal && (
        <AddCategoryModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchData}
        />
      )}

      {deleteTarget && (
        <DeleteCategoryModal
          category={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={fetchData}
        />
      )}
    </>
  );
}
