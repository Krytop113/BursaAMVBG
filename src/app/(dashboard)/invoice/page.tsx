"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { FileText, Download } from "lucide-react";
import {
  InvoiceFilters,
  InvoiceSummaryCards,
  InvoiceTable,
  InvoiceDetailModal,
  type ReportItem,
} from "@/components/invoice";

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

export default function InvoicePage() {
  const todayStr = new Date().toISOString().split("T")[0];
  const firstDayStr = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split("T")[0];

  // Filter State
  const [startDate, setStartDate] = useState(firstDayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [categoryId, setCategoryId] = useState("");
  const [productId, setProductId] = useState("");

  // Modal State
  const [selectedInvoice, setSelectedInvoice] = useState<ReportItem | null>(null);

  // Dropdown Data
  const { data: categoriesRes } = useCategories();
  const { data: productsRes } = useProducts();
  const categories = categoriesRes?.categories ?? [];
  const products = productsRes?.products ?? [];

  // Report Data
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

  const handleDownload = () => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (categoryId) params.append("categoryId", categoryId);
    if (productId) params.append("productId", productId);
    window.open(`/api/reports/export?${params.toString()}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="text-teal-400 w-7 h-7" />
            Rekapitulasi Penjualan & Invoice
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Pantau ringkasan hasil penjualan dan unduh laporan transaksi.
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={items.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-semibold rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          <span>Ekspor Laporan (CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <InvoiceFilters
        startDate={startDate}
        endDate={endDate}
        categoryId={categoryId}
        productId={productId}
        categories={categories}
        products={products}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onCategoryChange={setCategoryId}
        onProductChange={setProductId}
      />

      {/* Summary Metric Cards */}
      <InvoiceSummaryCards summary={summary} />

      {/* Transaction Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <h3 className="font-bold text-white">Rincian Transaksi Penjualan</h3>
          <span className="text-xs px-2.5 py-1 bg-gray-800 text-gray-300 rounded-full font-medium">
            {items.length} Transaksi
          </span>
        </div>
        <InvoiceTable
          items={items}
          isLoading={isLoading}
          onSelectInvoice={setSelectedInvoice}
        />
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <InvoiceDetailModal
          item={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
