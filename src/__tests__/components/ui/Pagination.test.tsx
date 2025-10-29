import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "@/components/ui/Pagination";

describe("Pagination", () => {
  it("renders page numbers with ellipses for long ranges", () => {
    const onPageChange = jest.fn();
    render(
      <Pagination
        totalItems={150}
        pageSize={10}
        currentPage={1}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("…")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("invokes onPageChange when clicking next and specific page", () => {
    const onPageChange = jest.fn();
    render(
      <Pagination
        totalItems={100}
        pageSize={10}
        currentPage={1}
        onPageChange={onPageChange}
      />
    );
    fireEvent.click(screen.getByText("Next"));
    expect(onPageChange).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByText("5"));
    expect(onPageChange).toHaveBeenCalledWith(5);
  });
});
