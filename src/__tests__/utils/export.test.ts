import { Transaction, FilterType, ExportOptions } from '@/types';
import { filterTransactions, exportToCSV, exportToXLSX, exportTransactions } from '@/utils/export';

// Mock file-saver
jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

// Mock xlsx
jest.mock('xlsx', () => ({
  utils: {
    json_to_sheet: jest.fn(),
    book_new: jest.fn(),
    book_append_sheet: jest.fn(),
  },
  write: jest.fn(),
}));

describe('Export Utilities', () => {
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      description: 'Test Credit',
      amount: 100,
      type: 'credit',
      date: '2023-01-01',
    },
    {
      id: '2',
      description: 'Test Debit',
      amount: 50,
      type: 'debit',
      date: '2023-01-02',
    },
  ];

  describe('filterTransactions', () => {
    it('returns all transactions when filter is "all"', () => {
      const result = filterTransactions(mockTransactions, 'all');
      expect(result).toEqual(mockTransactions);
    });

    it('filters credit transactions', () => {
      const result = filterTransactions(mockTransactions, 'credit');
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('credit');
    });

    it('filters debit transactions', () => {
      const result = filterTransactions(mockTransactions, 'debit');
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('debit');
    });
  });

  describe('exportToCSV', () => {
    it('calls saveAs with correct CSV content', () => {
      const { saveAs } = require('file-saver');
      exportToCSV(mockTransactions, 'test.csv');
      
      expect(saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        'test.csv'
      );
    });
  });

  describe('exportToXLSX', () => {
    it('calls saveAs with correct XLSX content', () => {
      const { saveAs } = require('file-saver');
      const xlsx = require('xlsx');
      
      exportToXLSX(mockTransactions, 'test.xlsx');
      
      expect(xlsx.utils.json_to_sheet).toHaveBeenCalled();
      expect(saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        'test.xlsx'
      );
    });
  });

  describe('exportTransactions', () => {
    it('exports CSV with correct filename', () => {
      const { saveAs } = require('file-saver');
      const options: ExportOptions = { format: 'csv', includeFilters: true };
      
      exportTransactions(mockTransactions, options, 'credit');
      
      expect(saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        expect.stringMatching(/transactions-\d{4}-\d{2}-\d{2}\.csv/)
      );
    });

    it('exports XLSX with correct filename', () => {
      const { saveAs } = require('file-saver');
      const options: ExportOptions = { format: 'xlsx', includeFilters: true };
      
      exportTransactions(mockTransactions, options, 'all');
      
      expect(saveAs).toHaveBeenCalledWith(
        expect.any(Blob),
        expect.stringMatching(/transactions-\d{4}-\d{2}-\d{2}\.xlsx/)
      );
    });
  });
});
