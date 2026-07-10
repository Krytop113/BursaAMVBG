"use client";

import { useQuery } from "@tanstack/react-query";
import type { Transaction } from "@/components/transactions/types";

export function useTransactions() {
  return useQuery<{ transactions: Transaction[] }>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await fetch("/api/transactions");
      if (!res.ok) throw new Error("Gagal mengambil data transaksi");
      return res.json();
    },
  });
}
