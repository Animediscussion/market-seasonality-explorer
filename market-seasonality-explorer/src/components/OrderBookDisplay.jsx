import React from "react";
import { useOrderBook } from "../hooks/useOrderbook";

const OrderBookDisplay = ({ symbol = "btcusdt" }) => {
  const { bids, asks } = useOrderBook(symbol.toLowerCase());

  return (
    <div className="p-4 border rounded shadow-sm max-w-sm bg-white">
      <h3 className="text-md font-semibold mb-2">
        Order Book ({symbol.toUpperCase()})
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="font-semibold mb-1">Bids</div>
          {bids.map(([price, qty], i) => (
            <div key={i} className="text-green-700 text-sm">
              {price} ({qty})
            </div>
          ))}
        </div>

        <div>
          <div className="font-semibold mb-1">Asks</div>
          {asks.map(([price, qty], i) => (
            <div key={i} className="text-red-700 text-sm">
              {price} ({qty})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderBookDisplay;
