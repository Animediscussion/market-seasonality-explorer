const instruments = ["BTC/USDT", "ETH/USDT", "SOL/USDT"];

const generateData = () => {
  const data = [];
  for (let day = 1; day <= 31; day++) {
    const date = `2024-07-${String(day).padStart(2, "0")}`;
    for (let instrument of instruments) {
      data.push({
        date,
        instrument,
        volatility: +(Math.random() * 3).toFixed(2),
        volume: Math.floor(Math.random() * 50000),
        priceChange: +(Math.random() * 4 - 2).toFixed(2), // Range: -2 to 2
      });
    }
  }
  return data;
};

export const sampleData = generateData();
