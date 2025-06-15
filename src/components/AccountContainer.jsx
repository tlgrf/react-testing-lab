import React, { useState, useEffect } from "react";
import TransactionsList from "./TransactionsList";
import Search from "./Search";
import AddTransactionForm from "./AddTransactionForm";
import Sort from "./Sort";

function AccountContainer() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("description");

  useEffect(() => {
    fetch("http://localhost:6001/transactions")
      .then((r) => r.json())
      .then((data) => setTransactions(data));
  }, []);

  function postTransaction(newTransaction) {
    fetch("http://localhost:6001/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTransaction),
    })
      .then((r) => r.json())
      .then((data) => setTransactions([...transactions, data]));
  }

  function onSort(field) {
    setSortBy(field);
  }

  // first filter by search term, then sort by selected field
  const displayedTransactions = transactions
    .filter((t) => {
      const term = search.toLowerCase();
      return (
        t.description.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1;
      if (a[sortBy] > b[sortBy]) return 1;
      return 0;
    });

  return (
    <div>
      <Search setSearch={setSearch} />
      <AddTransactionForm postTransaction={postTransaction} />
      <Sort onSort={onSort} />
      {/* only render table after we have at least one transaction */}
      {displayedTransactions.length > 0 && (
        <TransactionsList transactions={displayedTransactions} />
      )}
    </div>
  );
}

export default AccountContainer;