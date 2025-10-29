"use client";

import React, { useState } from "react";
import { Transaction, FilterType, ExportOptions } from "@/types";
import { exportTransactions } from "@/utils/export";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Card from "../ui/Card";

interface ExportButtonProps {
  transactions: Transaction[];
  filter: FilterType;
  asIconCard?: boolean; // when true, render mobile icon-card style trigger
  iconSize?: "sm" | "md";
}

const ExportButton: React.FC<ExportButtonProps> = ({
  transactions,
  filter,
  asIconCard,
  iconSize = "md",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "csv",
    includeFilters: true,
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate processing
      exportTransactions(transactions, exportOptions, filter);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      {asIconCard ? (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex flex-col items-center"
        >
          <div
            className={`${
              iconSize === "sm" ? "w-14 h-14" : "w-16 h-16"
            } rounded-2xl bg-gray-100 flex items-center justify-center`}
          >
            <svg
              className={`${
                iconSize === "sm" ? "w-5 h-5" : "w-6 h-6"
              } text-gray-700`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <span
            className={`mt-2 ${
              iconSize === "sm" ? "text-[11px]" : "text-xs"
            } text-gray-700`}
          >
            Export
          </span>
        </button>
      ) : (
        <Button
          variant="secondary"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>Export</span>
        </Button>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Export Transactions"
        size="sm"
      >
        <div className="space-y-4">
          <Card padding="sm">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="format"
                      value="csv"
                      checked={exportOptions.format === "csv"}
                      onChange={(e) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          format: e.target.value as "csv" | "xlsx",
                        }))
                      }
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      CSV (Comma Separated Values)
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="format"
                      value="xlsx"
                      checked={exportOptions.format === "xlsx"}
                      onChange={(e) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          format: e.target.value as "csv" | "xlsx",
                        }))
                      }
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Excel (XLSX)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeFilters}
                    onChange={(e) =>
                      setExportOptions((prev) => ({
                        ...prev,
                        includeFilters: e.target.checked,
                      }))
                    }
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Apply current filters
                  </span>
                </label>
              </div>

              <div className="text-xs text-gray-500">
                {exportOptions.includeFilters && filter !== "all" && (
                  <p>Exporting only {filter} transactions</p>
                )}
                <p>Total transactions: {transactions.length}</p>
              </div>
            </div>
          </Card>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleExport}
              isLoading={isExporting}
            >
              Export
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ExportButton;
