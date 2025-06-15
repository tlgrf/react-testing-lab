import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../../components/App";

const sampleTransactions = [
  { id: "1", date: "2021-01-01", description: "first", category: "food", amount: 10 },
  { id: "2", date: "2021-01-02", description: "second", category: "income", amount: 20 },
];

describe("display transactions", () => {
  beforeEach(() => {
    // stub fetch so we don't hit the real server
    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(sampleTransactions) })
    ));
  });

  test("shows transactions on load", async () => {
    render(<App />);
    // should call the backend once
    expect(fetch).toHaveBeenCalledWith("http://localhost:6001/transactions");

    // header row + one row per transaction
    const rows = await screen.findAllByRole("row");
    expect(rows).toHaveLength(sampleTransactions.length + 1);

    // first transaction should render
    expect(screen.getByText("first")).toBeInTheDocument();
  });
});