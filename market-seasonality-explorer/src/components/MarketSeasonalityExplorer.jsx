import { Select } from "antd";
import DailyView from "./DailyView";
import WeeklyView from "./WeeklyView";
import MonthlyView from "./MonthlyView";

const MarketSeasonalityExplorer = () => {
  const [viewMode, setViewMode] = useState("daily");

  return (
    <>
      <Select
        value={viewMode}
        onChange={setViewMode}
        options={[
          { label: "Daily", value: "daily" },
          { label: "Weekly", value: "weekly" },
          { label: "Monthly", value: "monthly" },
        ]}
        className="mb-4"
      />

      {viewMode === "daily" && <DailyView />}
      {viewMode === "weekly" && <WeeklyView />}
      {viewMode === "monthly" && <MonthlyView />}
    </>
  );
};

export default MarketSeasonalityExplorer;
