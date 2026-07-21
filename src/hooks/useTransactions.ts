"use client";

import { createResourceHook } from "./useResource";
import type { Transaction } from "@/components/transactions/types";
import { ROUTES } from "@/lib/paths";

export const useTransactions = createResourceHook<{ transactions: Transaction[] }>(
  "transactions",
  ROUTES.api.transactions,
  "Gagal mengambil data transaksi"
);
