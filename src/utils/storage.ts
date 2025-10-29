import { Transaction } from '@/types';

const STORAGE_KEY = 'afripay-transactions';

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save transactions to localStorage:', error);
  }
};

export const loadTransactions = (): Transaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load transactions from localStorage:', error);
    return [];
  }
};

export const clearTransactions = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear transactions from localStorage:', error);
  }
};
