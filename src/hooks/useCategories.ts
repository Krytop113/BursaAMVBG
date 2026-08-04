"use client";

import { createResourceHook } from "./useResource";
import type { Category } from "@/types";
import { ROUTES } from "@/lib/paths";

export const useCategories = createResourceHook<{ categories: Category[] }>(
  "categories",
  ROUTES.api.categories,
  "Gagal mengambil data kategori"
);

