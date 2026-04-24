import { useState } from 'react';
import './AlertTable.css';

const SEVERITY_ORDER = { CRITICAL: 0, WARNING: 1, NORMAL: 2 };

export default function AlertTable({ alerts = [], onSelect }) {
  const [sortBy, setSortBy] = useState('time');
  const [sortDir, setSortDir] = useState('desc');

  const sorted = [...alerts].sort((a, b) => {
    if (sortBy === 'severity') {
      const diff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
      return sortDir === 'asc' ? diff : -diff;
    }
    if (sortBy === 'score') {
      return sortDir === 'asc' ? a.score - b.score : b.score - a.score;
    }
    return sortDir === 'asc'
      ? new Date(a.timestamp) - new Date(b.timestamp)
      : new Date(b.timestamp) - new Date(a.timestamp);
  });

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  const SortIcon = ({ col }) => (
    <span className={`sort-icon ${sortBy === col ? 'active' : ''}`}>
      {sortBy === col ? (sortDir === 'asc' ? '↑' : '↓') : '⇅'}
    </span>
  );

  return (
    <div className="alert-table-wrapper">
      <div className="alert-table-header">
        <div className="section-label">EVENT LOG</div>
        <div className="section-title">Detected Anomalies</div>
      </div>
      <div className="alert-table-scroll">
        <table className="alert-table">
          <thead>
            <tr>
              <th className="th-id">#</th>
              <th className="th-time sortable" onClick={() => toggleSort('time')}>
                TIMESTAMP <SortIcon col="time" />
              </th>
              <th>SOURCE IP</th>
              <th>DEST IP</th>
              <th>ATTACK TYPE</th>
              <th className="th-score sortable" onClick={() => toggleSort('score')}>
                SCORE <SortIcon col="score" />
              </th>
              <th className="th-sev sortable" onClick={() => toggleSort('severity')}>
                SEVERITY <SortIcon col="severity" />
              </th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((alert, i) => (
              <tr
                key={alert.id}
                className={`alert-row alert-${alert.severity.toLowerCase()} ${alert.isNew ? 'new-alert' : ''}`}
                onClick={() => onSelect?.(alert)}
              >
                <td className="td-id mono">{String(i + 1).padStart(3, '0')}</td>
                <td className="td-time mono">{new Date(alert.timestamp).toLocaleTimeString('en-US', { hour12: false })}</td>
                <td className="mono">{alert.sourceIp}</td>
                <td className="mono">{alert.destIp}</td>
                <td>
                  <span className={`attack-type type-${alert.attackType?.toLowerCase().replace(/\s/g, '-')}`}>
                    {alert.attackType}
                  </span>
                </td>
                <td className="td-score">
                  <div className="score-wrap">
                    <div className="score-bar-bg">
                      <div
                        className={`score-bar-fill fill-${alert.severity.toLowerCase()}`}
                        style={{ width: `${alert.score}%` }}
                      />
                    </div>
                    <span className="score-val mono">{alert.score.toFixed(1)}</span>
                  </div>
                </td>
                <td>
                  <span className={`cyber-badge ${alert.severity.toLowerCase()}`}>
                    {alert.severity === 'CRITICAL' && <span className="blink-dot">●</span>}
                    {alert.severity}
                  </span>
                </td>
                <td>
                  <span className={`status-pill ${alert.resolved ? 'resolved' : 'active'}`}>
                    {alert.resolved ? 'RESOLVED' : 'ACTIVE'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <div className="empty-state mono">
            <span style={{ color: 'var(--accent-green)' }}>// NO ANOMALIES DETECTED IN CURRENT WINDOW</span>
          </div>
        )}
      </div>
      <div className="alert-table-footer mono">
        SHOWING {sorted.length} EVENTS · LAST UPDATED: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}