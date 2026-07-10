"use client";

import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/components/products/types";

export function useCategories() {
  return useQuery<{ categories: Category[] }>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Gagal mengambil data kategori");
      return res.json();
    },
  });
}
