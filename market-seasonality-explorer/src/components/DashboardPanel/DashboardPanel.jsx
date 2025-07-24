import React from "react";
import MetricChart from "../MetricChart";

// Helper to aggregate arrays of metrics over dates
function aggregateMetric(metricKey, data, dateRange) {
  const result = [];
  for (let date in data) {
    if (
      date >= dateRange.start &&
      date <= dateRange.end &&
      data[date][metricKey]
    ) {
      result.push(...data[date][metricKey]);
    }
  }
  // Sort by date ascending
  result.sort((a, b) => a.date.localeCompare(b.date));
  return result;
}

// Main Panel
function DashboardPanel({ instrument, dateRange, data = {} }) {
  // Null/undefined checks for props
  if (!dateRange || !dateRange.start || !dateRange.end) {
    return <p>Please select a date range.</p>;
  }
  if (!data || Object.keys(data).length === 0) {
    return <p>No data available.</p>;
  }

  // Filter data to only include instrument if data is instrument-based
  // If your data is structured as data[instrument][date], adjust accordingly
  const instrumentData = data; // Adjust this if needed

  // Aggregate metrics across date range
  const volatility = aggregateMetric("volatility", instrumentData, dateRange);
  const volume = aggregateMetric("volume", instrumentData, dateRange);
  const priceChange = aggregateMetric("priceChange", instrumentData, dateRange);

  // Guard: If nothing found, inform user
  if (
    volatility.length === 0 &&
    volume.length === 0 &&
    priceChange.length === 0
  ) {
    return (
      <p>
        No data available for {dateRange.start} to {dateRange.end}
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <MetricChart title="Volatility" data={volatility} color="#f97316" />
      <MetricChart title="Volume" data={volume} type="bar" color="#34d399" />
      <MetricChart
        title="Price Change (%)"
        data={priceChange}
        color="#60a5fa"
      />
    </div>
  );
}

export default DashboardPanel;
