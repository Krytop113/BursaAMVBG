"use client";

import { useQuery } from "@tanstack/react-query";

export interface DashboardData {
  success: boolean;
  stats: {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    maxSpentProduct: {
      name: string;
      value: number;
    };
    maxProfitProduct: {
      name: string;
      value: number;
    };
  };
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    price: number;
    categoryName: string;
  }>;
  topMutations: Array<{
    id: string;
    productName: string;
    quantity: number;
    type: "IN" | "OUT";
    date: string;
    note: string;
  }>;
}

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Gagal mengambil data dashboard");
      return res.json();
    },
  });
}
