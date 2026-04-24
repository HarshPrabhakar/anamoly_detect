import { useEffect, useRef, useState } from 'react';
import './RealTimeChart.css';

const MAX_POINTS = 60;
const THRESHOLD = 70;

function generatePoint(prev) {
  const base = prev ?? 30;
  const drift = (Math.random() - 0.48) * 12;
  const spike = Math.random() > 0.93 ? Math.random() * 50 : 0;
  return Math.max(0, Math.min(100, base + drift + spike));
}

export default function RealTimeChart({ filter = 'all' }) {
  const canvasRef = useRef(null);
  const dataRef = useRef(Array.from({ length: MAX_POINTS }, (_, i) => ({
    value: 20 + Math.sin(i / 5) * 15 + Math.random() * 10,
    time: Date.now() - (MAX_POINTS - i) * 1000,
  })));
  const animRef = useRef(null);
  const [stats, setStats] = useState({ current: 0, max: 0, anomalies: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const last = dataRef.current[dataRef.current.length - 1]?.value;
      const next = generatePoint(last);
      dataRef.current = [
        ...dataRef.current.slice(1),
        { value: next, time: Date.now() }
      ];
      const values = dataRef.current.map(d => d.value);
      setStats({
        current: next.toFixed(1),
        max: Math.max(...values).toFixed(1),
        anomalies: values.filter(v => v > THRESHOLD).length,
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const data = dataRef.current;

      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = '#050d1a';
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(0,212,255,0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = (H * 0.1) + (H * 0.8) * (i / 4);
        ctx.beginPath();
        ctx.setLineDash([4, 6]);
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Threshold line
      const threshY = H * 0.1 + H * 0.8 * (1 - THRESHOLD / 100);
      ctx.strokeStyle = 'rgba(255,149,0,0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(0, threshY);
      ctx.lineTo(W, threshY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(255,149,0,0.7)';
      ctx.font = '10px Share Tech Mono';
      ctx.fillText('THRESHOLD', W - 90, threshY - 4);

      // Y-axis labels
      ctx.fillStyle = 'rgba(0,212,255,0.4)';
      ctx.font = '9px Share Tech Mono';
      for (let i = 0; i <= 4; i++) {
        const val = 100 - i * 25;
        const y = H * 0.1 + H * 0.8 * (i / 4);
        ctx.fillText(val, 4, y + 4);
      }

      // Anomaly fill zones
      ctx.save();
      for (let i = 1; i < data.length; i++) {
        const x0 = (W / (MAX_POINTS - 1)) * (i - 1);
        const x1 = (W / (MAX_POINTS - 1)) * i;
        const v0 = data[i - 1].value;
        const v1 = data[i].value;
        if (v0 > THRESHOLD || v1 > THRESHOLD) {
          const y0 = H * 0.1 + H * 0.8 * (1 - v0 / 100);
          const y1 = H * 0.1 + H * 0.8 * (1 - v1 / 100);
          ctx.fillStyle = 'rgba(255,45,85,0.07)';
          ctx.fillRect(x0, Math.min(y0, y1, threshY), x1 - x0, H - Math.min(y0, y1, threshY));
        }
      }
      ctx.restore();

      // Fill gradient under line
      const gradient = ctx.createLinearGradient(0, H * 0.1, 0, H * 0.9);
      gradient.addColorStop(0, 'rgba(0,212,255,0.2)');
      gradient.addColorStop(1, 'rgba(0,212,255,0)');

      ctx.beginPath();
      data.forEach((pt, i) => {
        const x = (W / (MAX_POINTS - 1)) * i;
        const y = H * 0.1 + H * 0.8 * (1 - pt.value / 100);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      // Close fill
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Main line
      ctx.beginPath();
      data.forEach((pt, i) => {
        const x = (W / (MAX_POINTS - 1)) * i;
        const y = H * 0.1 + H * 0.8 * (1 - pt.value / 100);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Anomaly dots
      data.forEach((pt, i) => {
        if (pt.value > THRESHOLD) {
          const x = (W / (MAX_POINTS - 1)) * i;
          const y = H * 0.1 + H * 0.8 * (1 - pt.value / 100);
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#ff2d55';
          ctx.shadowColor = '#ff2d55';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Current value dot
      const last = data[data.length - 1];
      const lx = W - 2;
      const ly = H * 0.1 + H * 0.8 * (1 - last.value / 100);
      ctx.beginPath();
      ctx.arc(lx, ly, 5, 0, Math.PI * 2);
      ctx.fillStyle = last.value > THRESHOLD ? '#ff2d55' : '#00ff88';
      ctx.shadowColor = last.value > THRESHOLD ? '#ff2d55' : '#00ff88';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Resize handler
  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="rt-chart-wrapper">
      <div className="rt-chart-header">
        <div>
          <div className="section-label">LIVE FEED — ANOMALY SCORE STREAM</div>
          <div className="section-title">Network Anomaly Signal</div>
        </div>
        <div className="rt-chart-stats">
          <div className="rt-stat">
            <span className="rt-stat-label">CURRENT</span>
            <span className="rt-stat-value" style={{ color: stats.current > THRESHOLD ? 'var(--accent-red)' : 'var(--accent-cyan)' }}>
              {stats.current}
            </span>
          </div>
          <div className="rt-stat">
            <span className="rt-stat-label">MAX/WIN</span>
            <span className="rt-stat-value">{stats.max}</span>
          </div>
          <div className="rt-stat">
            <span className="rt-stat-label">ANOMALIES</span>
            <span className="rt-stat-value" style={{ color: stats.anomalies > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
              {stats.anomalies}
            </span>
          </div>
        </div>
      </div>
      <div className="rt-chart-canvas-wrap">
        <canvas ref={canvasRef} className="rt-chart-canvas" />
      </div>
      <div className="rt-chart-footer">
        <div className="rt-legend">
          <span className="rt-legend-item cyan">── ANOMALY SCORE</span>
          <span className="rt-legend-item orange">- - THRESHOLD (70)</span>
          <span className="rt-legend-item red">● ANOMALY EVENT</span>
        </div>
        <div className="rt-time-label mono">LAST 60 SECONDS</div>
      </div>
    </div>
  );
}