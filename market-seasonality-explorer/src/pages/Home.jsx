import React, { useState } from "react";
import DailyView from "../components/DailyView";
import DashboardPanel from "../components/DashboardPanel/DashboardPanel";
import { sampleData } from "../data/sampleData";

const Home = () => {
  const [selectedInstrument, setSelectedInstrument] = useState("BTC/USDT");
  const [fullData, setFullData] = useState(sampleData);
  const [selectedDate, setSelectedDate] = useState(null);

  // Support range selection: always provide { start, end }
  const handleDateSelect = (startDate, endDate = null) => {
    setSelectedDate({ start: startDate, end: endDate || startDate });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Market Calendar</h2>
        <DailyView
          onDateSelect={handleDateSelect}
          data={fullData}
          selectedInstrument={selectedInstrument}
          onInstrumentChange={setSelectedInstrument}
        />
      </div>

      {selectedDate && (
        <div className="w-full md:w-1/3">
          <h3 className="text-lg font-semibold mb-2">
            {/* Range or single day display */}
            {selectedDate.start === selectedDate.end
              ? `Details for ${selectedDate.start}`
              : `Details for ${selectedDate.start} to ${selectedDate.end}`}
          </h3>
          <DashboardPanel
            data={fullData}
            instrument={selectedInstrument}
            dateRange={selectedDate}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
