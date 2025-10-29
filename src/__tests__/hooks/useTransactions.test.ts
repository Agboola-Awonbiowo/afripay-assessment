import { renderHook, act } from '@testing-library/react';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionFormData } from '@/types';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useTransactions Hook', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it('initializes with empty transactions', () => {
    const { result } = renderHook(() => useTransactions());
    
    expect(result.current.transactions).toEqual([]);
    expect(result.current.filter).toBe('all');
    expect(result.current.isLoading).toBe(false);
  });

  it('loads transactions from localStorage on mount', () => {
    const mockTransactions = [
      { id: '1', description: 'Test', amount: 100, type: 'credit' as const, date: '2023-01-01' },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTransactions));

    const { result } = renderHook(() => useTransactions());
    
    expect(result.current.allTransactions).toEqual(mockTransactions);
  });

  it('adds a new transaction', () => {
    const { result } = renderHook(() => useTransactions());
    
    const formData: TransactionFormData = {
      description: 'Test Transaction',
      amount: '100.50',
      type: 'credit',
    };

    act(() => {
      result.current.addTransaction(formData);
    });

    expect(result.current.allTransactions).toHaveLength(1);
    expect(result.current.allTransactions[0]).toMatchObject({
      description: 'Test Transaction',
      amount: 100.50,
      type: 'credit',
    });
  });

  it('deletes a transaction', () => {
    const mockTransactions = [
      { id: '1', description: 'Test 1', amount: 100, type: 'credit' as const, date: '2023-01-01' },
      { id: '2', description: 'Test 2', amount: 50, type: 'debit' as const, date: '2023-01-02' },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTransactions));

    const { result } = renderHook(() => useTransactions());

    act(() => {
      result.current.deleteTransaction('1');
    });

    expect(result.current.allTransactions).toHaveLength(1);
    expect(result.current.allTransactions[0].id).toBe('2');
  });

  it('filters transactions correctly', () => {
    const mockTransactions = [
      { id: '1', description: 'Credit', amount: 100, type: 'credit' as const, date: '2023-01-01' },
      { id: '2', description: 'Debit', amount: 50, type: 'debit' as const, date: '2023-01-02' },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTransactions));

    const { result } = renderHook(() => useTransactions());

    act(() => {
      result.current.setFilter('credit');
    });

    expect(result.current.transactions).toHaveLength(1);
    expect(result.current.transactions[0].type).toBe('credit');
  });

  it('calculates summary correctly', () => {
    const mockTransactions = [
      { id: '1', description: 'Credit 1', amount: 100, type: 'credit' as const, date: '2023-01-01' },
      { id: '2', description: 'Credit 2', amount: 50, type: 'credit' as const, date: '2023-01-02' },
      { id: '3', description: 'Debit 1', amount: 75, type: 'debit' as const, date: '2023-01-03' },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTransactions));

    const { result } = renderHook(() => useTransactions());

    expect(result.current.summary).toEqual({
      totalInflow: 150,
      totalOutflow: 75,
      netBalance: 75,
    });
  });

  it('clears all transactions', () => {
    const mockTransactions = [
      { id: '1', description: 'Test', amount: 100, type: 'credit' as const, date: '2023-01-01' },
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockTransactions));

    const { result } = renderHook(() => useTransactions());

    act(() => {
      result.current.clearAllTransactions();
    });

    expect(result.current.allTransactions).toHaveLength(0);
  });
});
