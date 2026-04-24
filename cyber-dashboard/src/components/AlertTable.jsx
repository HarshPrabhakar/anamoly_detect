import { useState, useEffect } from "react";
import api from "../services/api";

export default function AlertTable({ filter }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const { data } = await api.getAlerts();
        // Filter on the client side – the API can do it as well
        const filtered = data.alerts.filter((a) => {
          // Example: keep alerts from the selected time window
          const ts = new Date(a.ts);
          const now = new Date();
          const delta = now - ts;
          const limitMs = filter === "1h" ? 60 * 60 * 1000 : 0;
          return limitMs === 0 || delta <= limitMs;
        });
        setAlerts(filtered);
      } catch (err) {
        console.warn(err);
      }
      setLoading(false);
    };
    fetchAlerts();
  }, [filter]);

  if (loading) return <p>Loading…</p>;

  return (
    <table className="alert-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Score</th>
          <th>Timestamp</th>
          <th>Detail</th>
        </tr>
      </thead>
      <tbody>
        {alerts.map((a) => (
          <tr key={a.id}>
            <td>{a.id}</td>
            <td>{a.score.toFixed(2)}</td>
            <td>{new Date(a.ts).toLocaleString()}</td>
            <td>
              <button onClick={() => console.log(a)}>View</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
