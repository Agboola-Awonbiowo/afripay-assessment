import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TransactionList from "@/components/transaction/TransactionList";
import { Transaction } from "@/types";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    description: "Test Credit",
    amount: 100,
    type: "credit",
    date: "2023-01-01",
  },
  {
    id: "2",
    description: "Test Debit",
    amount: 50,
    type: "debit",
    date: "2023-01-02",
  },
];

describe("TransactionList Component", () => {
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnDelete.mockClear();
    // Mock matchMedia for the component's mobile detection
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false, // default to desktop
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

  it("renders transactions correctly", () => {
    render(
      <TransactionList
        transactions={mockTransactions}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Test Credit")).toBeInTheDocument();
    expect(screen.getByText("Test Debit")).toBeInTheDocument();
    expect(screen.getByText("+$100.00")).toBeInTheDocument();
    expect(screen.getByText("-$50.00")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(
      <TransactionList
        transactions={[]}
        onDelete={mockOnDelete}
        isLoading={true}
      />
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows empty state when no transactions", () => {
    render(<TransactionList transactions={[]} onDelete={mockOnDelete} />);

    expect(screen.getByText("No transactions")).toBeInTheDocument();
    expect(
      screen.getByText("Get started by adding a new transaction.")
    ).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", () => {
    render(
      <TransactionList
        transactions={mockTransactions}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith("1");
  });

  it("displays correct transaction types with colors", () => {
    render(
      <TransactionList
        transactions={mockTransactions}
        onDelete={mockOnDelete}
      />
    );

    const creditAmounts = screen.getAllByText("+$100.00");
    const debitAmounts = screen.getAllByText("-$50.00");

    // check first match (both mobile/desktop render in jsdom)
    expect(creditAmounts[0]).toHaveClass("text-green-600");
    expect(debitAmounts[0]).toHaveClass("text-red-600");
  });

  it("formats dates correctly", () => {
    render(
      <TransactionList
        transactions={mockTransactions}
        onDelete={mockOnDelete}
      />
    );

    // Check that dates are displayed (exact format may vary by locale)
    expect(screen.getAllByText("1/1/2023").length).toBeGreaterThan(0);
    expect(screen.getAllByText("1/2/2023").length).toBeGreaterThan(0);
  });

  it("paginates on desktop - shows 10 per page and changes page", () => {
    const manyTx: Transaction[] = Array.from({ length: 25 }).map((_, i) => ({
      id: String(i + 1),
      description: `Tx ${i + 1}`,
      amount: i + 1,
      type: i % 2 === 0 ? "credit" : "debit",
      date: "2023-01-01",
    }));

    render(<TransactionList transactions={manyTx} onDelete={mockOnDelete} />);

    // Page 1 should show Tx 1 and not Tx 11
    expect(screen.getAllByText("Tx 1").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Tx 11").length).toBe(0);

    // Go to page 2
    fireEvent.click(screen.getByText("2"));
    expect(screen.getAllByText("Tx 11").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Tx 1").length).toBe(0);
  });
});
