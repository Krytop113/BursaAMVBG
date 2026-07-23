"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { generatePdfReport } from "@/lib/generatePdfReport";
import type { ReportItem } from "@/components/invoice/InvoiceTable";

interface ReportSummary {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  totalItemsSold: number;
}

interface RecapResponse {
  summary: ReportSummary;
  items: ReportItem[];
}

export function useInvoiceReport() {
  const todayStr = new Date().toISOString().split("T")[0];
  const firstDayStr = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(firstDayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [categoryId, setCategoryId] = useState("");
  const [productId, setProductId] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<ReportItem | null>(null);

  const { data: categoriesRes } = useCategories();
  const { data: productsRes } = useProducts();

  const categories = categoriesRes?.categories ?? [];
  const products = productsRes?.products ?? [];

  const { data: reportData, isLoading } = useQuery<RecapResponse>({
    queryKey: ["reportsRecap", startDate, endDate, categoryId, productId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (categoryId) params.append("categoryId", categoryId);
      if (productId) params.append("productId", productId);

      const res = await fetch(`/api/reports/recap?${params.toString()}`);
      if (!res.ok) throw new Error("Gagal memuat rekapitulasi penjualan.");
      return res.json();
    },
  });

  const summary = reportData?.summary ?? {
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    totalItemsSold: 0,
  };
  const items = reportData?.items ?? [];

  const handleDownloadCsv = () => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (categoryId) params.append("categoryId", categoryId);
    if (productId) params.append("productId", productId);

    window.open(`/api/reports/export?${params.toString()}`, "_blank");
  };

  const handleDownloadPdf = () => {
    if (items.length === 0) return;

    const selectedCat = categories.find((c) => c.id.toString() === categoryId)?.name;
    const selectedProd = products.find((p) => p.id === productId)?.name;

    generatePdfReport({
      items,
      startDate,
      endDate,
      categoryName: selectedCat,
      productName: selectedProd,
    });
  };

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    categoryId,
    setCategoryId,
    productId,
    setProductId,
    selectedInvoice,
    setSelectedInvoice,
    categories,
    products,
    summary,
    items,
    isLoading,
    handleDownloadCsv,
    handleDownloadPdf,
  };
}
