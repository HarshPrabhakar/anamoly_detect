import React, { useEffect, useState } from "react";

const FilterBar = ({ onFilterChange = () => {} }) => {
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Safe call
    onFilterChange(filter);
  }, [filter, onFilterChange]);

  return (
    <div style={{ marginBottom: "20px" }}>
      <button onClick={() => setFilter("all")}>All</button>
      <button onClick={() => setFilter("critical")}>Critical</button>
      <button onClick={() => setFilter("warning")}>Warning</button>
    </div>
  );
};

export default FilterBar;