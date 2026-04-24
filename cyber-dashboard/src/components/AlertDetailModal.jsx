import './AlertDetailModal.css';

export default function AlertDetailModal({ alert, onClose }) {
  if (!alert) return null;

  const features = [
    { name: 'duration', value: alert.features?.duration ?? '0', weight: 0.12 },
    { name: 'protocol_type', value: alert.features?.protocol ?? 'tcp', weight: 0.08 },
    { name: 'src_bytes', value: alert.features?.srcBytes ?? '1234', weight: 0.34 },
    { name: 'dst_bytes', value: alert.features?.dstBytes ?? '567', weight: 0.21 },
    { name: 'flag', value: alert.features?.flag ?? 'SF', weight: 0.09 },
    { name: 'land', value: alert.features?.land ?? '0', weight: 0.05 },
    { name: 'wrong_fragment', value: alert.features?.wrongFrag ?? '0', weight: 0.11 },
  ];

  const maxWeight = Math.max(...features.map(f => f.weight));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="bracket-corner tl" />
          <div className="bracket-corner tr" />
          <div>
            <div className="section-label">ANOMALY DETAIL — ID {alert.id}</div>
            <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {alert.attackType}
              <span className={`cyber-badge ${alert.severity.toLowerCase()}`}>{alert.severity}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕ CLOSE</button>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <div className="modal-section-label">NETWORK DETAILS</div>
            <div className="modal-grid">
              {[
                ['Source IP', alert.sourceIp],
                ['Destination IP', alert.destIp],
                ['Protocol', alert.protocol ?? 'TCP'],
                ['Port', alert.port ?? '443'],
                ['Timestamp', new Date(alert.timestamp).toLocaleString()],
                ['Duration', `${alert.features?.duration ?? 0}ms`],
              ].map(([k, v]) => (
                <div className="modal-kv" key={k}>
                  <span className="kv-key">{k}</span>
                  <span className="kv-val mono">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-section">
            <div className="modal-section-label">ANOMALY SCORE</div>
            <div className="modal-score-display">
              <div className="big-score" style={{ color: alert.severity === 'CRITICAL' ? 'var(--accent-red)' : 'var(--accent-orange)' }}>
                {alert.score.toFixed(2)}
              </div>
              <div className="score-progress-bg">
                <div
                  className={`score-progress-fill fill-${alert.severity.toLowerCase()}`}
                  style={{ width: `${alert.score}%` }}
                />
              </div>
              <div className="score-context mono">
                {alert.score > 85 ? 'EXTREME DEVIATION — Immediate action required' :
                 alert.score > 70 ? 'HIGH DEVIATION — Investigate immediately' :
                 'MODERATE DEVIATION — Monitor closely'}
              </div>
            </div>
          </div>

          <div className="modal-section">
            <div className="modal-section-label">EXPLAINABILITY — FEATURE IMPORTANCE (SHAP)</div>
            <div className="shap-chart">
              {features.sort((a, b) => b.weight - a.weight).map(f => (
                <div className="shap-row" key={f.name}>
                  <span className="shap-name mono">{f.name}</span>
                  <div className="shap-bar-bg">
                    <div
                      className="shap-bar-fill"
                      style={{ width: `${(f.weight / maxWeight) * 100}%`, opacity: 0.4 + f.weight }}
                    />
                  </div>
                  <span className="shap-value mono">{(f.weight * 100).toFixed(1)}%</span>
                  <span className="shap-feat-val mono">[{f.value}]</span>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-section">
            <div className="modal-section-label">MODEL CLASSIFICATION</div>
            <div className="model-outputs">
              {[
                { model: 'Isolation Forest', result: alert.attackType, confidence: '94.2%' },
                { model: 'Autoencoder', result: alert.attackType, confidence: '91.8%' },
                { model: 'Ensemble', result: alert.attackType, confidence: '96.1%' },
              ].map(m => (
                <div className="model-row" key={m.model}>
                  <span className="model-name">{m.model}</span>
                  <span className="model-result mono">{m.result}</span>
                  <span className="model-conf mono glow-green">{m.confidence}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="bracket-corner bl" />
          <div className="bracket-corner br" />
          <button className="cyber-btn" onClick={onClose}>DISMISS</button>
          <button className="cyber-btn danger">FLAG FALSE POSITIVE</button>
          <button className="cyber-btn" style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }}>
            MARK RESOLVED
          </button>
        </div>
      </div>
    </div>
  );
}