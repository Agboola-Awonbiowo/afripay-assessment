import React from "react";
import { TransactionSummary as SummaryType } from "@/types";
import Card from "../ui/Card";

interface TransactionSummaryProps {
  summary: SummaryType;
  isLoading?: boolean;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  summary,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const summaryItems = [
    {
      title: "Total Inflow",
      amount: summary.totalInflow,
      color: "text-green-600",
      bgColor: "bg-green-50",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 11l5-5m0 0l5 5m-5-5v12"
          />
        </svg>
      ),
    },
    {
      title: "Total Outflow",
      amount: summary.totalOutflow,
      color: "text-red-600",
      bgColor: "bg-red-50",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 13l-5 5m0 0l-5-5m5 5V6"
          />
        </svg>
      ),
    },
    {
      title: "Net Balance",
      amount: summary.netBalance,
      color: summary.netBalance >= 0 ? "text-green-600" : "text-red-600",
      bgColor: summary.netBalance >= 0 ? "bg-green-50" : "bg-red-50",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {summaryItems.map((item) => (
        <Card key={item.title} className="relative overflow-hidden">
          <div className={`${item.bgColor} p-3 rounded-lg mb-4`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">
                {item.title}
              </h3>
              <div className={`${item.color}`}>{item.icon}</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(item.amount)}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TransactionSummary;
