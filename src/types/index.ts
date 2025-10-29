export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  date: string;
}

export interface TransactionFormData {
  description: string;
  amount: string;
  type: 'credit' | 'debit';
}

export interface TransactionSummary {
  totalInflow: number;
  totalOutflow: number;
  netBalance: number;
}

export type FilterType = 'all' | 'credit' | 'debit';

export interface ExportOptions {
  format: 'csv' | 'xlsx';
  includeFilters: boolean;
}
