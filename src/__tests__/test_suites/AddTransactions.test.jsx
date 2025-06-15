import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../../components/App";

describe("add transactions", () => {
  beforeEach(() => {
    // stub fetch: first GET, then POST
    vi.stubGlobal("fetch", vi
      .fn()
      .mockResolvedValueOnce({
        json: () => Promise.resolve([
          { id: "1", date: "2021-01-01", description: "old", category: "misc", amount: 5 }
        ])
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve(
          { id: "2", date: "2021-01-02", description: "new", category: "cat", amount: 15 }
        )
      })
    );
  });

  test("adds a transaction and calls POST", async () => {
    const { container } = render(<App />);
    // wait for the existing txn
    await screen.findByText("old");

    // fill out the form
    const dateInput = container.querySelector('input[name="date"]');
    const descInput = screen.getByPlaceholderText("Description");
    const catInput  = screen.getByPlaceholderText("Category");
    const amtInput  = screen.getByPlaceholderText("Amount");

    fireEvent.change(dateInput, { target: { value: "2021-01-02" } });
    fireEvent.change(descInput, {  target: { value: "new" } });
    fireEvent.change(catInput, {   target: { value: "cat" } });
    fireEvent.change(amtInput, {   target: { value: "15" } });

    // click add
    fireEvent.click(screen.getByText(/add transaction/i));

    // wait for the POST call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("http://localhost:6001/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: "2021-01-02",
          description: "new",
          category: "cat",
          amount: "15"
        }),
      });
    });
    // new transaction should render:
    expect(screen.getByText("new")).toBeInTheDocument();
  });
});