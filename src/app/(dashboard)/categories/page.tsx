"use client";

import React, { useState } from "react";
import {
  CategoryPageHeader,
  CategoryTable,
  AddCategoryModal,
  DeleteCategoryModal,
} from "@/components/categories";
import type { Category } from "@/components/categories";
import { useCategories } from "@/hooks/useCategories";

export default function CategoriesPage() {
  const { data: categoriesData, isLoading } = useCategories();
  const categories = categoriesData?.categories ?? [];

  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

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
          onSuccess={() => setShowAddModal(false)}
        />
      )}

      {deleteTarget && (
        <DeleteCategoryModal
          category={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
