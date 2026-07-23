"use client";

import { createResourceHook } from "./useResource";
import type { Product } from "@/components/products/types";
import { ROUTES } from "@/lib/paths";

export const useProducts = createResourceHook<{ products: Product[] }>(
  "products",
  ROUTES.api.products,
  "Gagal mengambil data produk"
);
