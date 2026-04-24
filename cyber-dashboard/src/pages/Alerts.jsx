import { useState } from 'react';
import { useAlerts } from '../context/AlertsContext';
import AlertTable from '../components/AlertTable';
import FilterBar from '../components/FilterBar';
import AlertDetailModal from '../components/AlertDetailModal';
import './Alerts.css';

export default function Alerts() {
  const { alerts, counts } = useAlerts();
  const [filter, setFilter] = useState('all');
  const [timeWindow, setTimeWindow] = useState('1h');
  const [attackType, setAttackType] = useState('ALL');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const filtered = alerts.filter(a => {
    if (filter !== 'all' && a.severity.toLowerCase() !== filter) return false;
    if (attackType !== 'ALL' && a.attackType !== attackType) return false;
    return true;
  });

  const attackDistribution = {};
  alerts.forEach(a => {
    attackDistribution[a.attackType] = (attackDistribution[a.attackType] || 0) + 1;
  });

  return (
    <div className="alerts-page page-enter">
      <div className="page-header">
        <div>
          <div className="section-label">SECURITY EVENTS</div>
          <h1 className="page-title">Alerts &amp; Anomalies</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="cyber-btn">⬇ EXPORT CSV</button>
          <button className="cyber-btn danger">CLEAR ALL</button>
        </div>
      </div>

      {/* Attack type distribution */}
      <div className="attack-dist-grid">
        {Object.entries(attackDistribution).map(([type, count]) => (
          <div key={type} className="attack-dist-card">
            <div className="attack-dist-count mono">{count}</div>
            <div className="attack-dist-type">{type}</div>
            <div className="attack-dist-pct mono">
              {((count / alerts.length) * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      <FilterBar
        filter={filter}
        setFilter={setFilter}
        timeWindow={timeWindow}
        setTimeWindow={setTimeWindow}
        attackType={attackType}
        setAttackType={setAttackType}
        counts={counts}
      />

      <AlertTable alerts={filtered} onSelect={setSelectedAlert} />

      {selectedAlert && (
        <AlertDetailModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
      )}
    </div>
  );
}