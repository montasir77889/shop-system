import { useEffect, useState } from "react";
import { api } from "../api";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function RevenueChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.getRevenueChart()
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="panel revenue-panel">
      <h2>Revenue Overview</h2>
      <h2>
        📈 Revenue Overview
      </h2>

      <p
      style={{
      marginTop:-10,
      marginBottom:20,
      color:"#777",
      fontSize:"13px"
      }}
      >
      Last 7 days
      </p>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis
           tickFormatter={(value)=>`$${value}`} 
          />
          <Tooltip
          formatter={(value)=>[`$${value.toFixed(2)}`,"Revenue"]}
          />

          

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#c1443d"
            strokeWidth={4}
            dot={{r:5}}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}