"use client";

import React from "react";
import { InvoiceTable, type ReportItem } from "./InvoiceTable";

interface InvoiceTableCardProps {
  items: ReportItem[];
  isLoading: boolean;
  onSelectInvoice: (item: ReportItem) => void;
}

export function InvoiceTableCard({
  items,
  isLoading,
  onSelectInvoice,
}: InvoiceTableCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-5 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 dark:text-white">Rincian Transaksi Penjualan</h3>
        <span className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full font-medium">
          {items.length} Transaksi
        </span>
      </div>
      <InvoiceTable
        items={items}
        isLoading={isLoading}
        onSelectInvoice={onSelectInvoice}
      />
    </div>
  );
}
