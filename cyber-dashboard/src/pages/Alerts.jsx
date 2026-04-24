import React, { useState, useCallback } from "react";
import AlertTable from "../components/AlertTable";
import FilterBar from "../components/FilterBar";
import AlertDetailModal from "../components/AlertDetailModal";

export default function Alerts() {
  const [filter, setFilter] = useState("1h");
  const [selected, setSelected] = useState(null);

  const handleFilter = useCallback((value) => {
    setFilter(value);
  }, []);

  return (
    <section className="page">
      <h2>Alerts</h2>
      <FilterBar onFilterChange={handleFilter} />
      <AlertTable filter={filter} />
      <AlertDetailModal alert={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
