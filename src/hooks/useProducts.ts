"use client";

import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/components/products/types";

export function useProducts() {
  return useQuery<{ products: Product[] }>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Gagal mengambil data produk");
      return res.json();
    },
  });
}
