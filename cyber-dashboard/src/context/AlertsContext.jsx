import { createContext, useContext, useState, useEffect, useRef } from 'react';

const AlertsContext = createContext(null);

const ATTACK_TYPES = ['DoS', 'DDoS', 'Probe', 'U2R', 'R2L', 'Brute Force', 'Normal'];
const SEVERITIES = ['CRITICAL', 'WARNING', 'NORMAL'];
const PROTOCOLS = ['TCP', 'UDP', 'ICMP'];

function randomIp() {
  return `${Math.floor(Math.random() * 220) + 10}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`;
}

function generateAlert(id) {
  const score = Math.random() * 100;
  const attackIdx = Math.floor(Math.random() * ATTACK_TYPES.length);
  const attackType = ATTACK_TYPES[attackIdx];
  let severity;
  if (attackType === 'Normal' || score < 40) severity = 'NORMAL';
  else if (score < 70) severity = 'WARNING';
  else severity = 'CRITICAL';

  return {
    id: `ALT-${String(id).padStart(5, '0')}`,
    timestamp: new Date().toISOString(),
    sourceIp: randomIp(),
    destIp: randomIp(),
    attackType,
    severity,
    score,
    protocol: PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)],
    port: [80, 443, 22, 8080, 3306, 21][Math.floor(Math.random() * 6)],
    resolved: Math.random() > 0.8,
    isNew: true,
    features: {
      duration: Math.floor(Math.random() * 1000),
      protocol: PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)].toLowerCase(),
      srcBytes: Math.floor(Math.random() * 100000),
      dstBytes: Math.floor(Math.random() * 50000),
      flag: ['SF', 'S0', 'REJ', 'RSTR'][Math.floor(Math.random() * 4)],
      land: Math.random() > 0.9 ? '1' : '0',
      wrongFrag: Math.floor(Math.random() * 3),
    }
  };
}

export function AlertsProvider({ children }) {
  const [alerts, setAlerts] = useState(() =>
    Array.from({ length: 20 }, (_, i) => {
      const a = generateAlert(i + 1);
      a.isNew = false;
      a.timestamp = new Date(Date.now() - (20 - i) * 15000).toISOString();
      return a;
    })
  );
  const idRef = useRef(21);
  const [isSimulating, setIsSimulating] = useState(true);

  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      const newAlert = generateAlert(idRef.current++);
      setAlerts(prev => {
        const updated = prev.map(a => ({ ...a, isNew: false }));
        return [newAlert, ...updated].slice(0, 200);
      });
    }, 3000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const warningCount = alerts.filter(a => a.severity === 'WARNING').length;
  const normalCount = alerts.filter(a => a.severity === 'NORMAL').length;

  return (
    <AlertsContext.Provider value={{
      alerts,
      isSimulating,
      setIsSimulating,
      counts: {
        all: alerts.length,
        critical: criticalCount,
        warning: warningCount,
        normal: normalCount,
      }
    }}>
      {children}
    </AlertsContext.Provider>
  );
}

export const useAlerts = () => useContext(AlertsContext);