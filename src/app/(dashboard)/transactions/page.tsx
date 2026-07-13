"use client";

import React, { useState } from "react";
import {
  TransactionPageHeader,
  TransactionFilters,
  TransactionTable,
  AddTransactionModal,
  DeleteTransactionModal,
} from "@/components/transactions";
import { ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import type { Transaction } from "@/components/transactions";
import { useTransactions } from "@/hooks/useTransactions";
import { useProducts } from "@/hooks/useProducts";

export default function TransactionsPage() {
  const { data: transactionsData, isLoading: isTxLoading, refetch: refetchTransactions } = useTransactions();
  const { data: productsData } = useProducts();

  const transactions = transactionsData?.transactions ?? [];
  const products = productsData?.products ?? [];

  const [selectedType, setSelectedType] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter((t) => {
    const matchesType =
      selectedType === "Semua" || t.type === selectedType;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      t.productName.toLowerCase().includes(q) ||
      t.productQrCode.toLowerCase().includes(q) ||
      t.note.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  const handleResetFilter = () => {
    setSelectedType("Semua");
    setSearchQuery("");
  };

  // Kalkulasi 3 Metrik Overview Keuangan
  const totalPembelian = transactions
    .filter((t) => t.type === "IN")
    .reduce((sum, t) => sum + t.quantity * (t.productBuyPrice || 0), 0);

  const totalPengeluaran = transactions
    .filter((t) => t.type === "OUT")
    .reduce((sum, t) => sum + t.quantity * (t.productPrice || 0), 0);

  const totalBersih = totalPengeluaran - totalPembelian;

  return (
    <>
      <div className="space-y-6">
        <TransactionPageHeader onAddClick={() => setShowAddModal(true)} />

        {/* 3 Overview Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Card Pembelian */}
          <div className="bg-slate-900 border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-gray-400 text-xs font-medium">Total Pembelian (Barang Masuk)</span>
                <h3 className="text-xl font-bold text-red-400 mt-1">
                  Rp {totalPembelian.toLocaleString("id-ID")}
                </h3>
              </div>
              <div className="p-2.5 bg-red-500/10 rounded-lg border border-red-500/20 text-red-400">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">Akumulasi modal belanja stok produk</p>
          </div>

          {/* Card Pengeluaran / Penjualan */}
          <div className="bg-slate-900 border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-gray-400 text-xs font-medium">Total Penjualan (Barang Keluar)</span>
                <h3 className="text-xl font-bold text-teal-400 mt-1">
                  Rp {totalPengeluaran.toLocaleString("id-ID")}
                </h3>
              </div>
              <div className="p-2.5 bg-teal-500/10 rounded-lg border border-teal-500/20 text-teal-400">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">Total omzet dari penjualan produk keluar</p>
          </div>

          {/* Card Laba Bersih */}
          <div className="bg-slate-900 border border-gray-800 rounded-xl p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-gray-400 text-xs font-medium">Total Pendapatan Bersih</span>
                <h3 className={`text-xl font-bold mt-1 ${totalBersih >= 0 ? "text-purple-400" : "text-orange-500"}`}>
                  Rp {totalBersih.toLocaleString("id-ID")}
                </h3>
              </div>
              <div className="p-2.5 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-400">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">Selisih penjualan dikurangi modal pembelian</p>
          </div>
        </div>

        <TransactionFilters
          searchQuery={searchQuery}
          selectedType={selectedType}
          onSearchChange={setSearchQuery}
          onTypeChange={setSelectedType}
        />

        <TransactionTable
          transactions={transactions}
          filteredTransactions={filteredTransactions}
          isLoading={isTxLoading}
          searchQuery={searchQuery}
          selectedType={selectedType}
          onResetFilter={handleResetFilter}
          onDeleteClick={setDeleteTarget}
        />
      </div>

      {showAddModal && (
        <AddTransactionModal
          products={products}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => refetchTransactions()}
        />
      )}

      {deleteTarget && (
        <DeleteTransactionModal
          transaction={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={() => refetchTransactions()}
        />
      )}
    </>
  );
}
