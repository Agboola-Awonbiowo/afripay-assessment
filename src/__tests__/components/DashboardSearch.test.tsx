import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "@/components/Dashboard";

// Mock matchMedia used inside TransactionList for mobile detection
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });
});

// Mock useTransactions to provide deterministic data and avoid localStorage
jest.mock("@/hooks/useTransactions", () => {
  const transactions = [
    {
      id: "tx-1",
      description: "Rent payment",
      amount: 1200,
      type: "debit" as const,
      date: "2025-10-01",
    },
    {
      id: "tx-2",
      description: "Salary",
      amount: 5000,
      type: "credit" as const,
      date: "2025-10-02",
    },
    {
      id: "abc-3",
      description: "Grocery",
      amount: 150.55,
      type: "debit" as const,
      date: "2025-10-03",
    },
  ];
  return {
    useTransactions: () => ({
      transactions, // filtered by parent component
      allTransactions: transactions,
      filter: "all",
      setFilter: jest.fn(),
      addTransaction: jest.fn(),
      deleteTransaction: jest.fn(),
      clearAllTransactions: jest.fn(),
      summary: {
        totalInflow: 5000,
        totalOutflow: 1350.55,
        netBalance: 3649.45,
      },
      isLoading: false,
    }),
  };
});

describe("Dashboard search", () => {
  it("filters transactions by description/ID/date as user types", () => {
    render(<Dashboard />);

    // The search input next to tabs has placeholder "Search transactions..."
    const input = screen.getByPlaceholderText("Search transactions...");

    // Initially shows multiple transactions (note: jsdom doesn't apply CSS breakpoints,
    // so both mobile and desktop rows can render; use getAllByText)
    expect(screen.getAllByText("Rent payment").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Salary").length).toBeGreaterThan(0);

    // Search by description
    fireEvent.change(input, { target: { value: "grocery" } });
    expect(screen.getAllByText("Grocery").length).toBeGreaterThan(0);
    expect(screen.queryByText("Rent payment")).not.toBeInTheDocument();
    expect(screen.queryByText("Salary")).not.toBeInTheDocument();

    // Search by ID
    fireEvent.change(input, { target: { value: "tx-1" } });
    expect(screen.getAllByText("Rent payment").length).toBeGreaterThan(0);
    expect(screen.queryByText("Grocery")).not.toBeInTheDocument();

    // Search by date
    fireEvent.change(input, { target: { value: "2025-10-02" } });
    expect(screen.getAllByText("Salary").length).toBeGreaterThan(0);
  });
});
