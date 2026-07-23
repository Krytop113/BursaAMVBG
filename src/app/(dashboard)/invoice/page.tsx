"use client";

import { useInvoiceReport } from "@/hooks/useInvoiceReport";
import {
  InvoiceHeader,
  InvoiceFilters,
  InvoiceSummaryCards,
  InvoiceTableCard,
  InvoiceDetailModal,
} from "@/components/invoice";

export default function InvoicePage() {
  const {
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
  } = useInvoiceReport();

  return (
    <div className="space-y-6">
      {/* Header Halaman & Tombol Action PDF/CSV */}
      <InvoiceHeader
        hasData={items.length > 0}
        onDownloadPdf={handleDownloadPdf}
      />

      {/* Panel Filter Tanggal, Kategori, Produk */}
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

      {/* Kartu Ringkasan Metrik */}
      <InvoiceSummaryCards summary={summary} />

      {/* Tabel Data Penjualan */}
      <InvoiceTableCard
        items={items}
        isLoading={isLoading}
        onSelectInvoice={setSelectedInvoice}
      />

      {/* Modal Detail & Print Individual Invoice */}
      {selectedInvoice && (
        <InvoiceDetailModal
          item={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
