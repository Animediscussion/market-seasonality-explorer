import { useEffect, useState, useRef } from "react";

export const useOrderBook = (symbol = "btcusdt") => {
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    let isMounted = true; // to avoid state updates after unmount
    ws.current = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol}@depth`
    );

    ws.current.onmessage = (event) => {
      if (!isMounted) return;
      try {
        const data = JSON.parse(event.data);
        setBids(Array.isArray(data.b) ? data.b.slice(0, 5) : []);
        setAsks(Array.isArray(data.a) ? data.a.slice(0, 5) : []);
      } catch (err) {
        console.error("Error parsing websocket message", err);
      }
    };

    ws.current.onerror = (err) => {
      // You can handle errors here
      console.error("WebSocket error:", err);
    };

    ws.current.onclose = (event) => {
      // You can do cleanup/logging here if needed
      // console.log("WebSocket closed:", event);
    };

    return () => {
      isMounted = false;
      if (ws.current && ws.current.readyState === 1) {
        ws.current.close();
      }
    };
  }, [symbol]);

  return { bids, asks };
};
