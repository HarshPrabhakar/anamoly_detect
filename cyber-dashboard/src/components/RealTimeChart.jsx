import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import api from "../services/api";

/**
 * RealTimeChart
 * @component
 * Renders synthetic live data (mocked via `api.evaluatePacket`).
 */
export default function RealTimeChart({ interval = 5000 }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: res } = await api.getAlerts(); // just for demo purposes
        // If your backend returns { score, ts } you can use that
        const newData = res.alerts.slice(0, 20).map((a) => ({
          name: new Date(a.ts).toLocaleTimeString(),
          score: a.score,
        }));
        setData(newData);
      } catch (e) {
        console.warn(e);
      }
    };
    fetch();
    const t = setInterval(fetch, interval);
    return () => clearInterval(t);
  }, [interval]);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
