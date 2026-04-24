import './FilterBar.css';

const FILTERS = [
  { key: 'all', label: 'ALL EVENTS' },
  { key: 'critical', label: 'CRITICAL' },
  { key: 'warning', label: 'WARNING' },
  { key: 'normal', label: 'NORMAL' },
];

const ATTACK_TYPES = ['ALL', 'DoS', 'DDoS', 'Probe', 'U2R', 'R2L', 'Brute Force'];
const TIME_WINDOWS = ['1m', '5m', '15m', '1h', '6h', '24h'];

export default function FilterBar({ filter, setFilter, timeWindow, setTimeWindow, attackType, setAttackType, counts = {} }) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <span className="filter-group-label">SEVERITY</span>
        <div className="filter-pills">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`filter-pill pill-${f.key} ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
              {counts[f.key] != null && (
                <span className="pill-count">{counts[f.key]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-divider" />

      <div className="filter-group">
        <span className="filter-group-label">ATTACK TYPE</span>
        <div className="filter-pills">
          {ATTACK_TYPES.map(t => (
            <button
              key={t}
              className={`filter-pill ${attackType === t ? 'active' : ''}`}
              onClick={() => setAttackType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-divider" />

      <div className="filter-group">
        <span className="filter-group-label">TIME WINDOW</span>
        <div className="filter-pills">
          {TIME_WINDOWS.map(t => (
            <button
              key={t}
              className={`filter-pill ${timeWindow === t ? 'active' : ''}`}
              onClick={() => setTimeWindow(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}