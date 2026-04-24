import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const THREAT_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export default function Navbar({ alertCount = 0 }) {
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const [threatLevel] = useState('ELEVATED');

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const navItems = [
    { path: '/', label: 'OVERVIEW', icon: '⬡' },
    { path: '/alerts', label: 'ALERTS', icon: '◈', badge: alertCount },
    { path: '/settings', label: 'CONFIG', icon: '⬢' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="brand">
          <div className="brand-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" stroke="#00d4ff" strokeWidth="1.5" fill="none"/>
              <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" stroke="#00d4ff" strokeWidth="1" fill="rgba(0,212,255,0.08)"/>
              <circle cx="14" cy="14" r="3" fill="#00d4ff"/>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">CYBER<span className="brand-accent">SENTINEL</span></span>
            <span className="brand-sub">ANOMALY DETECTION SYSTEM v2.1</span>
          </div>
        </div>
      </div>

      <div className="navbar-center">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.badge > 0 && (
              <span className="nav-badge">{item.badge > 99 ? '99+' : item.badge}</span>
            )}
          </Link>
        ))}
      </div>

      <div className="navbar-right">
        <div className="threat-indicator">
          <span className="threat-label">THREAT LEVEL</span>
          <span className={`threat-level threat-${threatLevel.toLowerCase()}`}>{threatLevel}</span>
        </div>
        <div className="sys-clock">
          <span className="clock-label">UTC</span>
          <span className="clock-time">{time.toUTCString().split(' ')[4]}</span>
        </div>
        <div className="nav-status">
          <span className="status-dot live" />
          <span className="status-text">MONITORING</span>
        </div>
      </div>
    </nav>
  );
}