import React, { useState, useMemo } from "react";
import { Select, Checkbox, Tooltip, Drawer, Button } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import mockData from "../../data/mockData.json";
import "./CalendarView.css";
import MetricChart from "../MetricChart";

const instrumentOptions = ["BTC/USDT", "ETH/USDT", "SOL/USDT"];
const metricOptions = ["volatility", "volume", "priceChange"];

const getColorByVolatility = (v) => {
  if (v == null) return "#f0f2f5";
  if (v < 0.2) return "#adebad";
  if (v < 0.5) return "#ffd966";
  return "#ff6666";
};

function exportToCSV(data, filename = "export.csv") {
  if (!data || data.length === 0) return;

  const header = Object.keys(data[0]).join(",");
  const rows = data.map((row) =>
    Object.values(row)
      .map((val) => `"${val}"`)
      .join(",")
  );
  const csv = [header, ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const MonthlyView = () => {
  const [selectedInstrument, setSelectedInstrument] = useState("BTC/USDT");
  const [selectedMetrics, setSelectedMetrics] = useState(metricOptions);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const data = useMemo(
    () => mockData.filter((d) => d.instrument === selectedInstrument),
    [selectedInstrument]
  );

  const groupedByMonth = useMemo(() => {
    const months = {};
    data.forEach((entry) => {
      const [year, month] = entry.date.split("-");
      const key = `${year}-${month}`;
      if (!months[key]) months[key] = [];
      months[key].push(entry);
    });
    return months;
  }, [data]);

  const handleClick = (monthKey) => {
    setSelectedMonth(groupedByMonth[monthKey]);
    setIsDrawerOpen(true);
  };

  return (
    <>
      <div className="mse-filter-row">
        <Select
          value={selectedInstrument}
          onChange={setSelectedInstrument}
          style={{ width: 160 }}
          options={instrumentOptions.map((i) => ({ label: i, value: i }))}
        />
        <Checkbox.Group
          options={metricOptions}
          value={selectedMetrics}
          onChange={setSelectedMetrics}
          style={{ marginLeft: 16 }}
        />
        <Button onClick={() => exportToCSV(data)}>Export to CSV</Button>
      </div>

      <div className="calendar">
        {Object.entries(groupedByMonth).map(([monthKey, days]) => {
          const avgVolatility = average(days.map((d) => d.volatility));
          const totalVolume = days.reduce((sum, d) => sum + (d.volume || 0), 0);
          const priceChange = (days.at(-1)?.close ?? 0) - (days[0]?.open ?? 0);

          const bgColor = selectedMetrics.includes("volatility")
            ? getColorByVolatility(avgVolatility)
            : "#e0e0e0";

          return (
            <Tooltip
              key={monthKey}
              title={
                <>
                  <div>
                    <strong>{monthKey}</strong>
                  </div>
                  {selectedMetrics.includes("volatility") && (
                    <div>Volatility: {avgVolatility.toFixed(2)}</div>
                  )}
                  {selectedMetrics.includes("volume") && (
                    <div>Volume: {totalVolume}</div>
                  )}
                  {selectedMetrics.includes("priceChange") && (
                    <div>Δ Price: {priceChange.toFixed(2)}</div>
                  )}
                </>
              }
            >
              <div
                className="calendar-cell mse-cell-clickable"
                style={{ backgroundColor: bgColor }}
                onClick={() => handleClick(monthKey)}
              >
                <div className="mse-day-label">{monthKey}</div>

                {selectedMetrics.includes("priceChange") && (
                  <>
                    {priceChange > 0 && (
                      <ArrowUpOutlined
                        style={{ color: "green", fontSize: 14 }}
                      />
                    )}
                    {priceChange < 0 && (
                      <ArrowDownOutlined
                        style={{ color: "red", fontSize: 14 }}
                      />
                    )}
                  </>
                )}
              </div>
            </Tooltip>
          );
        })}
      </div>
      {/* Metrics Chart */}
      <MetricChart
        title="Monthly Volatility"
        data={data}
        type="line"
        dataKey="volatility"
        color="#8884d8"
      />

      <Drawer
        title="Monthly Summary"
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
      >
        {selectedMonth?.map((entry) => (
          <div key={entry.date} style={{ marginBottom: "1rem" }}>
            <strong>{entry.date}</strong>
            <div>Open: {entry.open}</div>
            <div>Close: {entry.close}</div>
            <div>Volatility: {entry.volatility}</div>
            <div>Volume: {entry.volume}</div>
            <div>Price Change: {entry.priceChange}</div>
          </div>
        ))}
      </Drawer>
    </>
  );
};

export default MonthlyView;

// Utility function
function average(arr) {
  const valid = arr.filter((v) => v != null);
  return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
}
