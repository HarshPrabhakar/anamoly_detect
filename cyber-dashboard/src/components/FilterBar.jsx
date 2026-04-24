import { useState, useEffect } from "react";

export default function FilterBar({ onFilterChange }) {
  const [timeRange, setTimeRange] = useState("1h");

  useEffect(() => {
    onFilterChange(timeRange);
  }, [timeRange, onFilterChange]);

  return (
    <div className="filter-bar">
      <label>
        Time range:
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="15m">15 min</option>
          <option value="1h">1 h</option>
          <option value="6h">6 h</option>
          <option value="24h">24 h</option>
        </select>
      </label>
    </div>
  );
}
