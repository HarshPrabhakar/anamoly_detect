import React from "react";
import RealTimeChart from "../components/RealTimeChart";
import FilterBar from "../components/FilterBar";

export default function Home() {
  return (
    <section className="page">
      <h2>Dashboard</h2>
      <FilterBar />          {/* Future filter hook can be wired here */}
      <RealTimeChart />
    </section>
  );
}
