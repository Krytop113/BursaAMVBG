"use client";

import React from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { SkeletonStatCard } from "@/components/ui";
import {
  DashboardOverview,
  DashboardHighlights,
  LowStockTable,
  TopMutationsTable
} from "@/components/dashboard";

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useDashboard();

  if (isLoading || !dashboardData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Dashboard Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">Memuat statistik realtime...</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, idx) => (
            <SkeletonStatCard key={idx} />
          ))}
        </div>
      </div>
    );
  }

  const { stats, lowStockProducts, topMutations } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          Dashboard Analytics
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Berikut ringkasan performa keuangan dan logistik toko Anda secara real-time.
        </p>
      </div>

      {/* 3 Stats Grid Component */}
      <DashboardOverview stats={stats} />

      {/* Highlights Produk Berkinerja Tinggi Component */}
      <DashboardHighlights stats={stats} />

      {/* Grid Utama (List Produk Minim Stok & Mutasi Teratas) Components */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <LowStockTable products={lowStockProducts} />
        <TopMutationsTable mutations={topMutations} />
      </div>
    </div>
  );
}
