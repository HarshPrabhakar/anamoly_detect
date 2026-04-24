import React, { useState } from "react";
import RealTimeChart from "../components/RealTimeChart";
import FilterBar from "../components/FilterBar";

export default function Home() {
  const [filter, setFilter] = useState("all");

  const handleFilterChange = (selectedFilter) => {
    console.log("Filter selected:", selectedFilter);
    setFilter(selectedFilter);
  };

  return (
    <section className="page">
      <h2>Dashboard</h2>

      {/* ✅ FIX: pass function */}
      <FilterBar onFilterChange={handleFilterChange} />

      {/* (optional) pass filter to chart later */}
      <RealTimeChart filter={filter} />
    </section>
  );
}