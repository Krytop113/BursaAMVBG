"use client";

import React from "react";
import { TrendingUp, Award } from "lucide-react";

interface SalesTrendItem {
  label: string;
  revenue: number;
  profit: number;
}

interface SalesTrendChartProps {
  trendData: SalesTrendItem[];
}

export function SalesTrendChart({ trendData }: SalesTrendChartProps) {
  const maxVal = Math.max(...trendData.map((s) => Math.max(s.revenue, s.profit)), 1000);

  return (
    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-6">
      {/* Chart Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
            <TrendingUp className="text-teal-400 w-5 h-5" />
            Tren Penjualan 7 Hari Terakhir
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Perbandingan omset kotor dan keuntungan bersih harian.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-teal-500 rounded-full" />
            <span className="text-gray-600 dark:text-gray-300">Omset</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-emerald-400">Keuntungan</span>
          </div>
        </div>
      </div>

      {/* Visual Chart Container */}
      <div className="h-64 flex items-end justify-between gap-2 pt-6 border-b border-slate-200 dark:border-gray-800 px-2">
        {trendData.map((day, idx) => {
          const revenueHeight = (day.revenue / maxVal) * 100;
          const profitHeight = (day.profit / maxVal) * 100;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              {/* Tooltip on Hover */}
              <div className="absolute bottom-full mb-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-2xl text-[10px] space-y-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 min-w-120px text-center">
                <p className="font-bold text-gray-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 pb-1">{day.label}</p>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-slate-400">Omset:</span>
                  <span className="font-bold text-teal-400">Rp {day.revenue.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-slate-400">Profit:</span>
                  <span className="font-bold text-emerald-400">Rp {day.profit.toLocaleString("id-ID")}</span>
                </div>
              </div>

              {/* Pillars Group */}
              <div className="flex items-end gap-1 w-full justify-center h-[85%]">
                {/* Revenue Pillar (Teal) */}
                <div
                  style={{ height: `${Math.max(revenueHeight, 3)}%` }}
                  className="w-3 sm:w-4 bg-linear-to-t from-teal-600 to-teal-400 rounded-t-lg transition-all duration-500 group-hover:brightness-110 shadow-lg shadow-teal-500/10"
                />

                {/* Profit Pillar (Emerald) */}
                <div
                  style={{ height: `${Math.max(profitHeight, 3)}%` }}
                  className="w-3 sm:w-4 bg-linear-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-500 group-hover:brightness-110 shadow-lg shadow-emerald-500/10"
                />
              </div>

              {/* X-Axis Label */}
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-3 select-none text-center">
                {day.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
