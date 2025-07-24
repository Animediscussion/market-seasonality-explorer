import React, { useState } from "react";
import { Tabs } from "antd";
import DailyView from "./DailyView";
import WeeklyView from "./WeeklyView";
import MonthlyView from "./MonthlyView";

const { TabPane } = Tabs;

const CalendarView = () => {
  const [view, setView] = useState("monthly");

  return (
    <div>
      <Tabs defaultActiveKey="monthly" onChange={(key) => setView(key)}>
        <TabPane tab="Daily" key="daily">
          <DailyView />
        </TabPane>
        <TabPane tab="Weekly" key="weekly">
          <WeeklyView />
        </TabPane>
        <TabPane tab="Monthly" key="monthly">
          <MonthlyView />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CalendarView;
