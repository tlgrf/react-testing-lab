import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../../components/App";

// reversed initial order so sorting actually reorders
const sampleTransactions = [
  { id: "1", date: "2021-01-02", description: "beta",  category: "income", amount: 10 },
  { id: "2", date: "2021-01-01", description: "alpha", category: "food",   amount: 5 },
];

describe("search and sort transactions", () => {
  beforeEach(() => {
    // stub fetch to return our reversed sample data
    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(sampleTransactions) })
    ));
  });

  test("filters list when typing", async () => {
    render(<App />);
    await screen.findByText("alpha");

    const input = screen.getByPlaceholderText(/search your recent transactions/i);
    fireEvent.change(input, { target: { value: "beta" } });

    expect(screen.queryByText("alpha")).not.toBeInTheDocument();
    expect(screen.getByText("beta")).toBeInTheDocument();
  });

  test("sorts list when dropdown changes", async () => {
    render(<App />);
    await screen.findByText("alpha");

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "description" } });

    const rows = screen.getAllByRole("row");
    // after sorting by description, 'alpha' should now be the first data row
    expect(rows[1].textContent).toContain("alpha");
  });
});