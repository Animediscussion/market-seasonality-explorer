import React, { useState, useMemo } from "react";
import { Select, Checkbox, Tooltip, Drawer, Button } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import mockData from "../../data/mockData.json";
import "./CalendarView.css";
import DateDetailModal from "../DateDetailModal/DateDetailModal";
import MetricChart from "../MetricChart";

const instrumentOptions = ["BTC/USDT", "ETH/USDT", "SOL/USDT"];
const metricOptions = ["volatility", "volume", "priceChange"];
const DAYS_IN_MONTH = 31;

const getColorByVolatility = (v) => {
  if (v == null) return "#f0f2f5";
  if (v < 0.2) return "#22c55e";
  if (v < 0.5) return "#f59e0b";
  return "#ef4444";
};

const getVolumeDotSize = (volume) => {
  if (volume == null) return 0;
  if (volume > 20000) return 14;
  if (volume > 10000) return 10;
  if (volume > 5000) return 7;
  return 5;
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

const DailyView = () => {
  const [selectedInstrument, setSelectedInstrument] = useState("BTC/USDT");
  const [selectedMetrics, setSelectedMetrics] = useState(metricOptions);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Filter by instrument
  const filteredData = useMemo(
    () => mockData.filter((d) => d.instrument === selectedInstrument),
    [selectedInstrument]
  );

  // Date string to record map
  const dataMap = useMemo(() => {
    const map = {};
    filteredData.forEach((d) => {
      map[d.date] = d;
    });
    return map;
  }, [filteredData]);

  const days = useMemo(
    () => Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
    []
  );

  const handleCellClick = (day) => {
    const dateStr = `2023-01-${String(day).padStart(2, "0")}`; // Use actual data dates
    const rec = dataMap[dateStr] || { date: dateStr };
    setSelectedDate({ ...rec });
    setIsDrawerOpen(true);
  };

  return (
    <>
      {/* FILTERS */}
      <div className="flex items-center gap-4 mb-4">
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
        <Button onClick={() => exportToCSV(filteredData)}>Export to CSV</Button>
      </div>

      {/* CALENDAR GRID */}
      <div className="calendar grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dateStr = `2023-01-${String(day).padStart(2, "0")}`;
          const dayData = dataMap[dateStr];
          const vol = dayData?.volatility;
          const volume = dayData?.volume;
          const priceChange = dayData?.priceChange;

          const bgColor = selectedMetrics.includes("volatility")
            ? getColorByVolatility(vol)
            : "#e0e0e0";
          const dotSize = selectedMetrics.includes("volume")
            ? getVolumeDotSize(volume)
            : 0;

          const tooltipContent = dayData ? (
            <div>
              <div>
                <strong>{dateStr}</strong>
              </div>
              {vol != null && <div>Volatility: {vol}</div>}
              {volume != null && <div>Volume: {volume}</div>}
              {priceChange != null && <div>Price Change: {priceChange}%</div>}
            </div>
          ) : (
            <div>
              <strong>{dateStr}</strong>
              <div>No data</div>
            </div>
          );

          return (
            <Tooltip key={day} title={tooltipContent}>
              <div
                className="calendar-cell p-2 rounded shadow text-center mse-cell-clickable flex flex-col items-center justify-center"
                style={{
                  backgroundColor: vol ? bgColor : "#e0e0e0",
                  cursor: "pointer",
                  minHeight: 64,
                }}
                onClick={() => {
                  setModalData(
                    dayData ? { ...dayData, date: dateStr } : { date: dateStr }
                  );
                  setModalOpen(true);
                }}
              >
                <div className="font-medium">{day}</div>
                {dotSize > 0 && (
                  <div
                    className="mse-volume-dot mt-1 bg-black rounded-full"
                    style={{ width: dotSize, height: dotSize }}
                  />
                )}
                {selectedMetrics.includes("priceChange") && (
                  <div className="mt-1">
                    {priceChange > 0 && (
                      <ArrowUpOutlined
                        style={{ color: "#22c55e", fontSize: 14 }}
                      />
                    )}
                    {priceChange < 0 && (
                      <ArrowDownOutlined
                        style={{ color: "#ef4444", fontSize: 14 }}
                      />
                    )}
                    {priceChange === 0 && priceChange != null && (
                      <span className="text-gray-500" style={{ fontSize: 14 }}>
                        –
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Tooltip>
          );
        })}
      </div>
      {/* Metrics Chart */}
      <MetricChart
        title="Volatility Over Time"
        data={filteredData}
        type="line"
        dataKey="volatility"
        color="#8884d8"
      />

      {/* SUMMARY SECTION */}
      {selectedDate && modalData && (
        <Drawer
          title={`Detailed Data – ${selectedDate.date || ""}`}
          placement="right"
          onClose={() => setIsDrawerOpen(false)}
          open={isDrawerOpen}
          width={360}
        >
          {selectedDate ? (
            <div className="mse-detail-panel">
              <DetailRow label="Instrument" value={selectedDate.instrument} />
              <DetailRow label="Volatility" value={selectedDate.volatility} />
              <DetailRow label="Volume" value={selectedDate.volume} />
              <DetailRow
                label="Price Change (%)"
                value={selectedDate.priceChange}
              />
              <DetailRow label="Open" value={selectedDate.open} />
              <DetailRow label="Close" value={selectedDate.close} />
              <DetailRow label="High" value={selectedDate.high} />
              <DetailRow label="Low" value={selectedDate.low} />
            </div>
          ) : (
            <p>No data.</p>
          )}
        </Drawer>
      )}

      {/* Date Detail Modal */}
      <DateDetailModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        data={modalData}
      />
    </>
  );
};

function DetailRow({ label, value }) {
  return (
    <div className="mse-detail-row flex items-center mb-2">
      <span className="mse-detail-label font-semibold w-32">{label}:</span>
      <span className="mse-detail-value">
        {value !== null && value !== undefined && value !== "" ? value : "—"}
      </span>
    </div>
  );
}

export default DailyView;
