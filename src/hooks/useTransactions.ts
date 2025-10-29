import { useState, useEffect, useCallback } from "react";
import { Transaction, TransactionFormData, FilterType } from "@/types";
import { saveTransactions, loadTransactions } from "@/utils/storage";

const generateDummyTransactions = (count: number): Transaction[] => {
  const descriptionsCredit = [
    "Salary",
    "Transfer from John",
    "Refund",
    "Gift",
    "Interest",
    "Bonus",
    "Cashback",
  ];
  const descriptionsDebit = [
    "Groceries",
    "Restaurant",
    "Fuel",
    "Electricity Bill",
    "Internet",
    "Rent",
    "School Fees",
  ];
  const items: Transaction[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const isCredit = i % 2 === 0; // alternate for variety
    const amount = parseFloat((Math.random() * 900 + 100).toFixed(2));
    const date = new Date(now);
    date.setDate(now.getDate() - (i % 30));
    items.push({
      id: `${Date.now()}_${i}_${Math.random().toString(36).slice(2, 7)}`,
      description: isCredit
        ? descriptionsCredit[i % descriptionsCredit.length]
        : descriptionsDebit[i % descriptionsDebit.length],
      amount,
      type: isCredit ? "credit" : "debit",
      date: date.toISOString().split("T")[0],
    });
  }
  return items;
};

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const loadedTransactions = loadTransactions();
    if (loadedTransactions.length === 0) {
      const seeded = generateDummyTransactions(100);
      setTransactions(seeded);
      saveTransactions(seeded);
    } else {
      setTransactions(loadedTransactions);
    }
    setIsLoading(false);
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    if (!isLoading) {
      saveTransactions(transactions);
    }
  }, [transactions, isLoading]);

  const addTransaction = useCallback((formData: TransactionFormData) => {
    const newTransaction: Transaction = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      description: formData.description.trim(),
      amount: parseFloat(formData.amount),
      type: formData.type,
      date: new Date().toISOString().split("T")[0],
    };

    setTransactions((prev) => [newTransaction, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) =>
      prev.filter((transaction) => transaction.id !== id)
    );
  }, []);

  const clearAllTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true;
    return transaction.type === filter;
  });

  const summary = {
    totalInflow: transactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0),
    totalOutflow: transactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0),
    netBalance: 0,
  };

  summary.netBalance = summary.totalInflow - summary.totalOutflow;

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    filter,
    setFilter,
    addTransaction,
    deleteTransaction,
    clearAllTransactions,
    summary,
    isLoading,
  };
};
