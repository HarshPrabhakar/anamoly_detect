import { useState } from 'react';
import { useAlerts } from '../context/AlertsContext';
import RealTimeChart from '../components/RealTimeChart';
import AlertTable from '../components/AlertTable';
import FilterBar from '../components/FilterBar';
import AlertDetailModal from '../components/AlertDetailModal';
import './Home.css';

function StatCard({ label, value, sub, accent, icon, trend }) {
  return (
    <div className={`stat-card accent-${accent}`}>
      <div className="stat-card-top">
        <div className="stat-icon">{icon}</div>
        <div className={`stat-trend ${trend > 0 ? 'up' : 'down'}`}>
          {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </div>
      </div>
      <div className="stat-value mono">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub mono">{sub}</div>}
      <div className="stat-card-bar">
        <div className="stat-card-bar-fill" />
      </div>
    </div>
  );
}

function ThreatMap() {
  // Mini world threat map using SVG dots
  const threats = [
    { x: 22, y: 38, size: 3 }, { x: 48, y: 25, size: 4 }, { x: 52, y: 28, size: 2 },
    { x: 60, y: 35, size: 5 }, { x: 75, y: 30, size: 3 }, { x: 82, y: 55, size: 2 },
    { x: 30, y: 60, size: 3 }, { x: 15, y: 45, size: 4 }, { x: 70, y: 20, size: 2 },
    { x: 90, y: 40, size: 3 }, { x: 35, y: 70, size: 2 }, { x: 55, y: 65, size: 4 },
  ];
  return (
    <div className="threat-map">
      <div className="section-label">GLOBAL THREAT ORIGIN MAP</div>
      <div className="section-title" style={{ marginBottom: 12 }}>Attack Source Distribution</div>
      <div className="map-container">
        <svg viewBox="0 0 100 65" className="map-svg" preserveAspectRatio="xMidYMid meet">
          {/* Simplified continents */}
          <path d="M8,25 Q15,18 25,20 Q30,25 28,35 Q20,42 12,38 Z" fill="rgba(0,212,255,0.08)" stroke="rgba(0,212,255,0.15)" strokeWidth="0.3"/>
          <path d="M35,20 Q50,15 65,18 Q70,25 68,38 Q60,45 48,43 Q38,40 35,30 Z" fill="rgba(0,212,255,0.08)" stroke="rgba(0,212,255,0.15)" strokeWidth="0.3"/>
          <path d="M48,44 Q55,42 62,48 Q58,58 50,60 Q44,56 48,44 Z" fill="rgba(0,212,255,0.06)" stroke="rgba(0,212,255,0.15)" strokeWidth="0.3"/>
          <path d="M68,20 Q80,15 88,25 Q85,38 78,40 Q68,35 68,20 Z" fill="rgba(0,212,255,0.08)" stroke="rgba(0,212,255,0.15)" strokeWidth="0.3"/>
          <path d="M72,42 Q80,40 85,50 Q82,58 75,58 Q70,52 72,42 Z" fill="rgba(0,212,255,0.06)" stroke="rgba(0,212,255,0.15)" strokeWidth="0.3"/>

          {/* Grid lines */}
          {[20, 40, 60].map(x => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="65" stroke="rgba(0,212,255,0.05)" strokeWidth="0.3"/>
          ))}
          {[20, 40].map(y => (
            <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="rgba(0,212,255,0.05)" strokeWidth="0.3"/>
          ))}

          {/* Threat dots */}
          {threats.map((t, i) => (
            <g key={i}>
              <circle cx={t.x} cy={t.y} r={t.size * 1.8} fill={`rgba(255,45,85,0.08)`}/>
              <circle cx={t.x} cy={t.y} r={t.size * 0.8} fill="#ff2d55" opacity={0.8}>
                <animate attributeName="r" values={`${t.size * 0.8};${t.size * 1.6};${t.size * 0.8}`} dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.8;0.3;0.8" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite"/>
              </circle>
            </g>
          ))}
        </svg>
        <div className="map-legend">
          <span className="map-legend-item red">● ACTIVE THREAT</span>
          <span className="map-legend-item">12 ORIGINS DETECTED</span>
        </div>
      </div>
    </div>
  );
}

function ModelMetrics() {
  const metrics = [
    { name: 'Isolation Forest', precision: 94.2, recall: 91.8, f1: 93.0, status: 'active' },
    { name: 'Autoencoder (AE)', precision: 91.4, recall: 93.1, f1: 92.2, status: 'active' },
    { name: 'Ensemble', precision: 96.1, recall: 94.7, f1: 95.4, status: 'active' },
    { name: 'LSTM (Training)', precision: 88.2, recall: 87.5, f1: 87.8, status: 'training' },
  ];

  return (
    <div className="model-metrics">
      <div className="section-label">ML MODELS</div>
      <div className="section-title" style={{ marginBottom: 14 }}>Model Performance</div>
      <div className="metrics-list">
        {metrics.map(m => (
          <div key={m.name} className="metric-row">
            <div className="metric-info">
              <div className="metric-name">{m.name}</div>
              <span className={`cyber-badge ${m.status === 'active' ? 'normal' : 'info'}`}>
                {m.status === 'active' ? 'ACTIVE' : 'TRAINING'}
              </span>
            </div>
            <div className="metric-bars">
              {[['P', m.precision], ['R', m.recall], ['F1', m.f1]].map(([label, val]) => (
                <div className="metric-bar-wrap" key={label}>
                  <span className="metric-bar-label">{label}</span>
                  <div className="metric-bar-bg">
                    <div className="metric-bar-fill" style={{ width: `${val}%` }} />
                  </div>
                  <span className="metric-bar-val mono">{val}%</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { alerts, counts, isSimulating, setIsSimulating } = useAlerts();
  const [filter, setFilter] = useState('all');
  const [timeWindow, setTimeWindow] = useState('15m');
  const [attackType, setAttackType] = useState('ALL');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const filtered = alerts.filter(a => {
    if (filter !== 'all' && a.severity.toLowerCase() !== filter) return false;
    if (attackType !== 'ALL' && a.attackType !== attackType) return false;
    return true;
  });

  const stats = [
    { label: 'Total Events', value: counts.all, sub: 'LAST 24H', accent: 'cyan', icon: '◈', trend: 12 },
    { label: 'Critical Alerts', value: counts.critical, sub: 'REQUIRES ACTION', accent: 'red', icon: '⚠', trend: 8 },
    { label: 'Warnings', value: counts.warning, sub: 'MONITOR', accent: 'orange', icon: '◉', trend: -3 },
    { label: 'Resolved', value: alerts.filter(a => a.resolved).length, sub: 'AUTO-MITIGATED', accent: 'green', icon: '✓', trend: 5 },
  ];

  return (
    <div className="home-page page-enter">
      <div className="home-top-bar">
        <div>
          <div className="section-label">MAIN DASHBOARD</div>
          <h1 className="page-title">Network Anomaly Overview</h1>
        </div>
        <div className="top-bar-actions">
          <button
            className={`cyber-btn ${isSimulating ? 'active' : ''}`}
            onClick={() => setIsSimulating(v => !v)}
          >
            {isSimulating ? '■ STOP SIM' : '▶ START SIM'}
          </button>
          <div className="live-indicator">
            <span className="status-dot live" />
            <span className="mono" style={{ fontSize: 11, color: 'var(--accent-green)', letterSpacing: '0.12em' }}>
              LIVE MONITORING
            </span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stat-cards-row">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Real-time chart + threat map */}
      <div className="charts-row">
        <div className="chart-main">
          <RealTimeChart filter={filter} />
        </div>
        <div className="charts-side">
          <ThreatMap />
          <ModelMetrics />
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filter={filter}
        setFilter={setFilter}
        timeWindow={timeWindow}
        setTimeWindow={setTimeWindow}
        attackType={attackType}
        setAttackType={setAttackType}
        counts={counts}
      />

      {/* Alert table */}
      <AlertTable alerts={filtered} onSelect={setSelectedAlert} />

      {selectedAlert && (
        <AlertDetailModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
      )}
    </div>
  );
}