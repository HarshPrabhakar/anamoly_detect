import { useState } from 'react';
import './Settings.css';

function ToggleSwitch({ value, onChange }) {
  return (
    <div className={`toggle-switch ${value ? 'on' : 'off'}`} onClick={() => onChange(!value)}>
      <div className="toggle-thumb" />
    </div>
  );
}

function Slider({ value, onChange, min = 0, max = 100, step = 1 }) {
  return (
    <div className="slider-wrap">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="cyber-slider"
      />
      <span className="slider-val mono">{value}</span>
    </div>
  );
}

function SettingRow({ label, desc, children }) {
  return (
    <div className="setting-row">
      <div className="setting-info">
        <div className="setting-label">{label}</div>
        {desc && <div className="setting-desc">{desc}</div>}
      </div>
      <div className="setting-control">{children}</div>
    </div>
  );
}

function SettingSection({ title, children }) {
  return (
    <div className="setting-section">
      <div className="setting-section-title mono">{title}</div>
      <div className="setting-section-body">{children}</div>
    </div>
  );
}

export default function Settings() {
  const [threshold, setThreshold] = useState(70);
  const [alertEnabled, setAlertEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [autoResolve, setAutoResolve] = useState(true);
  const [simInterval, setSimInterval] = useState(3);
  const [model, setModel] = useState('ensemble');
  const [explainability, setExplainability] = useState(true);
  const [retentionDays, setRetentionDays] = useState(30);
  const [darkMode] = useState(true);

  return (
    <div className="settings-page page-enter">
      <div className="page-header">
        <div>
          <div className="section-label">SYSTEM CONFIGURATION</div>
          <h1 className="page-title">Settings</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="cyber-btn">RESET DEFAULTS</button>
          <button className="cyber-btn" style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
            SAVE CONFIG
          </button>
        </div>
      </div>

      <div className="settings-layout">
        <div className="settings-main">

          <SettingSection title="// DETECTION ENGINE">
            <SettingRow label="Anomaly Threshold" desc="Anomaly score above this value triggers an alert (0–100)">
              <Slider value={threshold} onChange={setThreshold} />
            </SettingRow>
            <SettingRow label="Active Model" desc="Primary ML model used for anomaly classification">
              <select className="cyber-select" value={model} onChange={e => setModel(e.target.value)}>
                <option value="isolation_forest">Isolation Forest</option>
                <option value="autoencoder">Autoencoder (AE)</option>
                <option value="ensemble">Ensemble (Recommended)</option>
                <option value="lstm">LSTM (Beta)</option>
              </select>
            </SettingRow>
            <SettingRow label="Explainability (SHAP)" desc="Generate SHAP feature importance for each anomaly">
              <ToggleSwitch value={explainability} onChange={setExplainability} />
            </SettingRow>
          </SettingSection>

          <SettingSection title="// ALERT MANAGEMENT">
            <SettingRow label="Alerts Enabled" desc="Enable or disable the alert system globally">
              <ToggleSwitch value={alertEnabled} onChange={setAlertEnabled} />
            </SettingRow>
            <SettingRow label="Email Notifications" desc="Send email for critical severity events">
              <ToggleSwitch value={emailAlerts} onChange={setEmailAlerts} />
            </SettingRow>
            <SettingRow label="Auto-Resolve Normal" desc="Automatically mark low-risk events as resolved">
              <ToggleSwitch value={autoResolve} onChange={setAutoResolve} />
            </SettingRow>
            <SettingRow label="Data Retention (days)" desc="How long to retain alert history">
              <Slider value={retentionDays} onChange={setRetentionDays} min={1} max={365} />
            </SettingRow>
          </SettingSection>

          <SettingSection title="// SIMULATION SETTINGS">
            <SettingRow label="Traffic Simulation" desc="Simulate real-time network traffic events">
              <ToggleSwitch value={true} onChange={() => {}} />
            </SettingRow>
            <SettingRow label="Event Interval (seconds)" desc="How frequently simulated events are generated">
              <Slider value={simInterval} onChange={setSimInterval} min={1} max={30} />
            </SettingRow>
          </SettingSection>

          <SettingSection title="// BACKEND CONNECTION">
            <SettingRow label="API Endpoint" desc="Node.js/Flask backend server URL">
              <input
                type="text"
                className="cyber-input"
                defaultValue="http://localhost:5000/api"
                spellCheck={false}
              />
            </SettingRow>
            <SettingRow label="WebSocket Feed" desc="Real-time traffic WebSocket URL">
              <input
                type="text"
                className="cyber-input"
                defaultValue="ws://localhost:5000/feed"
                spellCheck={false}
              />
            </SettingRow>
          </SettingSection>

        </div>

        <div className="settings-sidebar">
          <div className="cyber-card">
            <div className="section-label">SYSTEM STATUS</div>
            <div className="sys-status-list">
              {[
                { label: 'Detection Engine', status: 'ONLINE' },
                { label: 'ML Models', status: 'ACTIVE' },
                { label: 'Data Pipeline', status: 'RUNNING' },
                { label: 'Alert System', status: alertEnabled ? 'ENABLED' : 'DISABLED' },
                { label: 'WebSocket Feed', status: 'CONNECTED' },
                { label: 'Database', status: 'CONNECTED' },
              ].map(({ label, status }) => (
                <div className="sys-status-row" key={label}>
                  <span className="sys-status-label">{label}</span>
                  <span className={`sys-status-val mono ${status === 'ONLINE' || status === 'ACTIVE' || status === 'RUNNING' || status === 'CONNECTED' || status === 'ENABLED' ? 'text-green' : 'text-orange'}`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="cyber-card">
            <div className="section-label">DATASET INFO</div>
            <div className="sys-status-list">
              {[
                ['Dataset', 'CICIDS2017'],
                ['Features', '78 columns'],
                ['Train samples', '2.8M'],
                ['Test samples', '557K'],
                ['Last retrain', '2 hrs ago'],
              ].map(([k, v]) => (
                <div className="sys-status-row" key={k}>
                  <span className="sys-status-label">{k}</span>
                  <span className="sys-status-val mono">{v}</span>
                </div>
              ))}
            </div>
            <button className="cyber-btn" style={{ width: '100%', marginTop: 12, justifyContent: 'center' }}>
              RETRAIN MODEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}