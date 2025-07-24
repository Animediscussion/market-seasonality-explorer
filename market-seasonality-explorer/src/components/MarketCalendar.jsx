// src/components/MarketCalendar.jsx
import React, { useState } from "react";
import { Tabs } from "antd";
import DailyView from "./CalendarView/DailyView";
import WeeklyView from "./CalendarView/WeeklyView";
import MonthlyView from "./CalendarView/MonthlyView";
import DashboardPanel from "./DashboardPanel/DashboardPanel";

const MarketCalendar = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        📅 Market Seasonality Explorer
      </h2>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "daily",
            label: "Daily View",
            children: <DailyView onDateSelect={setSelectedDate} />,
          },
          {
            key: "weekly",
            label: "Weekly View",
            children: <WeeklyView onDateSelect={setSelectedDate} />,
          },
          {
            key: "monthly",
            label: "Monthly View",
            children: <MonthlyView onDateSelect={setSelectedDate} />,
          },
        ]}
      />
      {selectedDate && (
        <>
          <h3 className="text-lg font-medium mt-6">
            Metrics for {selectedDate}
          </h3>
          <DashboardPanel selectedDate={selectedDate} />
        </>
      )}
    </div>
  );
};

export default MarketCalendar;
