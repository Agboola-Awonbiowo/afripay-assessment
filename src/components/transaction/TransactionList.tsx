import React, { useEffect, useRef, useState } from "react";
import { Transaction } from "@/types";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Pagination from "../ui/Pagination";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDelete,
  isLoading = false,
}) => {
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsLoaded, setItemsLoaded] = useState(PAGE_SIZE);
  const [isMobile, setIsMobile] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Detect mobile (match Tailwind sm breakpoint)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Clamp values to data size instead of resetting state on change
  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const itemsLoadedSafe = Math.min(itemsLoaded, transactions.length || 0);

  // Infinite scroll for mobile
  useEffect(() => {
    if (!isMobile) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          setItemsLoaded((prev) =>
            Math.min(prev + PAGE_SIZE, transactions.length)
          );
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile, transactions.length]);

  const start = isMobile ? 0 : (currentPageSafe - 1) * PAGE_SIZE;
  const end = isMobile ? itemsLoadedSafe : start + PAGE_SIZE;
  const visibleTransactions = transactions.slice(start, end);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      onDelete(transactionToDelete.id);
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTransactionToDelete(null);
  };

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsViewModalOpen(true);
  };

  const handleCloseView = () => {
    setIsViewModalOpen(false);
    setSelectedTransaction(null);
  };
  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <span>Loading...</span>
        </div>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No transactions
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new transaction.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card padding="sm">
        <div className="space-y-4">
          {visibleTransactions.map((transaction) => {
            const isCredit = transaction.type === "credit";
            const sign = isCredit ? "+" : "-";
            const amountStr = transaction.amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            return (
              <div
                key={transaction.id}
                className="p-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer"
                onClick={() => handleRowClick(transaction)}
              >
                {/* Mobile layout */}
                <div className="flex items-center sm:hidden">
                  <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center mr-2">
                    <svg
                      className={`w-5 h-5 ${
                        isCredit ? "text-green-600" : "text-red-600"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                          isCredit
                            ? "M5 10l7-7m0 0l7 7m-7-7v18"
                            : "M19 14l-7 7m0 0l-7-7m7 7V3"
                        }
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 truncate">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-400">
                      {isCredit ? "Payment Received" : "Payment Sent"}
                    </p>
                    <p className="text-[10px] text-gray-400 hidden xs:block truncate">
                      ID: {transaction.id}
                    </p>
                  </div>
                  <div className="text-right ml-2">
                    <p
                      className={`${
                        isCredit ? "text-green-600" : "text-red-600"
                      } font-semibold`}
                    >
                      {sign}${amountStr}{" "}
                      <span className="text-[11px] lowercase text-gray-400">
                        usd
                      </span>
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Desktop layout (unchanged structure) */}
                <div className="hidden sm:flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <svg
                          className={`w-5 h-5 ${
                            isCredit ? "text-green-600" : "text-red-600"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={
                              isCredit
                                ? "M5 10l7-7m0 0l7 7m-7-7v18"
                                : "M19 14l-7 7m0 0l-7-7m7 7V3"
                            }
                          />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {transaction.description}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">
                          ID: {transaction.id}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`text-lg font-semibold ${
                        isCredit ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {sign}${amountStr}
                    </span>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(transaction);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Desktop pagination */}
      <div className="mt-4 hidden sm:flex">
        <Pagination
          totalItems={transactions.length}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Mobile infinite scroll sentinel */}
      <div ref={sentinelRef} className="sm:hidden h-2" />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        title="Delete Transaction"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this transaction? This action cannot
            be undone.
          </p>
          {transactionToDelete && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-900">
                {transactionToDelete.description}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(transactionToDelete.date).toLocaleDateString()} •
                <span
                  className={`ml-1 ${
                    transactionToDelete.type === "credit"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transactionToDelete.type === "credit" ? "+" : "-"}$
                  {transactionToDelete.amount.toFixed(2)}
                </span>
              </p>
            </div>
          )}
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete Transaction
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Transaction Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={handleCloseView}
        title="Transaction Details"
        size="sm"
      >
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col space-y-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  ID
                </span>
                <span className="text-sm text-gray-900 break-all font-mono bg-gray-50 p-2 rounded">
                  {selectedTransaction.id}
                </span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Description
                </span>
                <span className="text-sm text-gray-900">
                  {selectedTransaction.description}
                </span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Type
                </span>
                <span className="text-sm text-gray-900 capitalize">
                  {selectedTransaction.type}
                </span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Date
                </span>
                <span className="text-sm text-gray-900">
                  {new Date(selectedTransaction.date).toLocaleString()}
                </span>
              </div>

              <div className="flex flex-col space-y-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Amount
                </span>
                <span
                  className={`text-lg font-semibold ${
                    selectedTransaction.type === "credit"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedTransaction.type === "credit" ? "+" : "-"}$
                  {selectedTransaction.amount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-200">
              <Button variant="secondary" onClick={handleCloseView}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default TransactionList;
