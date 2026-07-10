"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  TransactionPageHeader,
  TransactionFilters,
  TransactionTable,
  AddTransactionModal,
  DeleteTransactionModal,
} from "@/components/transactions";
import type { Transaction, Product } from "@/components/transactions";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [txRes, prodRes] = await Promise.all([
        fetch("/api/transactions"),
        fetch("/api/products"),
      ]);
      const [txData, prodData] = await Promise.all([
        txRes.json(),
        prodRes.json(),
      ]);
      if (txRes.ok) setTransactions(txData.transactions ?? []);
      if (prodRes.ok) setProducts(prodData.products ?? []);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  return (
    <>
      <div className="space-y-6">
        <TransactionPageHeader onAddClick={() => setShowAddModal(true)} />

        <TransactionFilters
          searchQuery={searchQuery}
          selectedType={selectedType}
          onSearchChange={setSearchQuery}
          onTypeChange={setSelectedType}
        />

        <TransactionTable
          transactions={transactions}
          filteredTransactions={filteredTransactions}
          isLoading={isLoading}
          searchQuery={searchQuery}
          selectedType={selectedType}
          onResetFilter={handleResetFilter}
          onDeleteClick={setDeleteTarget}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddTransactionModal
          products={products}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchData}
        />
      )}

      {deleteTarget && (
        <DeleteTransactionModal
          transaction={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={fetchData}
        />
      )}
    </>
  );
}
