"use client";

import React, { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionFormData } from "@/types";
import TransactionSummary from "./transaction/TransactionSummary";
import FilterTabs from "./transaction/FilterTabs";
import TransactionList from "./transaction/TransactionList";
import TransactionForm from "./transaction/TransactionForm";
import Input from "./ui/Input";
import ExportButton from "./transaction/ExportButton";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

const Dashboard: React.FC = () => {
  const {
    transactions,
    allTransactions,
    filter,
    setFilter,
    addTransaction,
    deleteTransaction,
    clearAllTransactions,
    summary,
    isLoading,
  } = useTransactions();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState<"credit" | "debit">(
    "credit"
  );
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddTransaction = (formData: TransactionFormData) => {
    addTransaction(formData);
    setIsAddModalOpen(false);
  };

  const handleClearAll = () => {
    clearAllTransactions();
    setIsClearModalOpen(false);
  };

  const transactionCounts = {
    all: allTransactions.length,
    credit: allTransactions.filter((t) => t.type === "credit").length,
    debit: allTransactions.filter((t) => t.type === "debit").length,
  };

  const displayedTransactions = transactions.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.description.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.date.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="sm:flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                Transaction Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Manage your financial transactions with ease
              </p>
            </div>
            {/* Desktop actions */}
            <div className="hidden sm:flex sm:items-center sm:space-x-3 mt-4 sm:mt-0">
              <Button
                variant="primary"
                onClick={() => {
                  setModalDefaultType("credit");
                  setIsAddModalOpen(true);
                }}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Money
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setModalDefaultType("debit");
                  setIsAddModalOpen(true);
                }}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
                Send Money
              </Button>
              <ExportButton
                transactions={displayedTransactions}
                filter={filter}
              />
              {allTransactions.length > 0 && (
                <Button
                  variant="danger"
                  onClick={() => setIsClearModalOpen(true)}
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Mobile quick actions */}
            <div className="grid grid-cols-4 gap-1 mt-4 sm:hidden">
              <button
                type="button"
                onClick={() => {
                  setModalDefaultType("credit");
                  setIsAddModalOpen(true);
                }}
                className="flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                </div>
                <span className="mt-1 text-[11px] text-gray-700">Add</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setModalDefaultType("debit");
                  setIsAddModalOpen(true);
                }}
                className="flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
                <span className="mt-1 text-[11px] text-gray-700">Send</span>
              </button>

              <ExportButton
                transactions={displayedTransactions}
                filter={filter}
                asIconCard
                iconSize="sm"
              />

              <button
                type="button"
                onClick={() => setIsClearModalOpen(true)}
                className="flex flex-col items-center"
                disabled={allTransactions.length === 0}
              >
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a2 2 0 012-2h2a2 2 0 012 2v2"
                    />
                  </svg>
                </div>
                <span className="mt-1 text-[11px] text-gray-700">Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-8">
          <TransactionSummary summary={summary} isLoading={isLoading} />
        </div>

        {/* Filter Tabs + Search */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <FilterTabs
              activeFilter={filter}
              onFilterChange={setFilter}
              transactionCounts={transactionCounts}
            />
            <div className="w-64 ml-4 hidden sm:block">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.75 3.75a7.5 7.5 0 0012.9 12.9z"
                  />
                </svg>
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <TransactionList
          key={filter}
          transactions={displayedTransactions}
          onDelete={deleteTransaction}
          isLoading={isLoading}
        />

        {/* Add Transaction Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={modalDefaultType === "credit" ? "Add Money" : "Send Money"}
          size="md"
        >
          <TransactionForm
            onSubmit={handleAddTransaction}
            onCancel={() => setIsAddModalOpen(false)}
            defaultType={modalDefaultType}
            showTypeSelector={false}
          />
        </Modal>

        {/* Clear All Confirmation Modal */}
        <Modal
          isOpen={isClearModalOpen}
          onClose={() => setIsClearModalOpen(false)}
          title="Clear All Transactions"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to clear all transactions? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setIsClearModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={handleClearAll}>
                Clear All
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
