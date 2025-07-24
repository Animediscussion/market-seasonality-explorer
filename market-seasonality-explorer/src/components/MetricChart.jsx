import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const MetricChart = ({
  title,
  data,
  type = "line",
  dataKey = "value",
  color = "#8884d8",
}) => {
  return (
    <div className="bg-white p-4 rounded shadow-md mb-6">
      <h3 className="text-md font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {type === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={dataKey} stroke={color} />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={dataKey} fill={color} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default MetricChart;
