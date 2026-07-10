"use client";

import React, { useState } from "react";
import {
  TransactionPageHeader,
  TransactionFilters,
  TransactionTable,
  AddTransactionModal,
  DeleteTransactionModal,
} from "@/components/transactions";
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
