"use client";

import { DollarSign, TrendingUp, ShoppingBag, ClipboardList } from "lucide-react";

interface ReportSummary {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  totalItemsSold: number;
}

interface InvoiceSummaryCardsProps {
  summary: ReportSummary;
}

export function InvoiceSummaryCards({ summary }: InvoiceSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-medium">Total Omset</p>
          <p className="text-lg sm:text-2xl font-bold text-white">
            Rp {summary.totalRevenue.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400 shrink-0">
          <DollarSign className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-medium">Total Modal</p>
          <p className="text-lg sm:text-2xl font-bold text-white">
            Rp {summary.totalCost.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 shrink-0">
          <ClipboardList className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-medium">Total Untung</p>
          <p className="text-lg sm:text-2xl font-bold text-emerald-400">
            Rp {summary.totalProfit.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-medium">Terjual</p>
          <p className="text-lg sm:text-2xl font-bold text-white">
            {summary.totalItemsSold} pcs
          </p>
        </div>
        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 shrink-0">
          <ShoppingBag className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
