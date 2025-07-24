import React from "react";
import MarketCalendar from "./components/MarketCalendar";
import OrderBookDisplay from "./components/OrderBookDisplay";

function App() {
  return (
    <div className="App p-4">
      <MarketCalendar />
      <div className="mt-8">
        <OrderBookDisplay symbol="BTCUSDT" />
      </div>
    </div>
  );
}

export default App;
