import { Transaction, FilterType, ExportOptions } from '@/types';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const filterTransactions = (
  transactions: Transaction[],
  filter: FilterType
): Transaction[] => {
  if (filter === 'all') return transactions;
  return transactions.filter(transaction => transaction.type === filter);
};

export const exportToCSV = (
  transactions: Transaction[],
  filename: string = 'transactions.csv'
): void => {
  const headers = ['ID', 'Description', 'Amount', 'Type', 'Date'];
  const csvContent = [
    headers.join(','),
    ...transactions.map(transaction =>
      [
        transaction.id,
        `"${transaction.description}"`,
        transaction.amount,
        transaction.type,
        transaction.date
      ].join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
};

export const exportToXLSX = (
  transactions: Transaction[],
  filename: string = 'transactions.xlsx'
): void => {
  const worksheet = XLSX.utils.json_to_sheet(
    transactions.map(transaction => ({
      ID: transaction.id,
      Description: transaction.description,
      Amount: transaction.amount,
      Type: transaction.type,
      Date: transaction.date
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, filename);
};

export const exportTransactions = (
  transactions: Transaction[],
  options: ExportOptions,
  filter: FilterType = 'all'
): void => {
  const filteredTransactions = filterTransactions(transactions, filter);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `transactions-${timestamp}`;

  if (options.format === 'csv') {
    exportToCSV(filteredTransactions, `${filename}.csv`);
  } else {
    exportToXLSX(filteredTransactions, `${filename}.xlsx`);
  }
};
