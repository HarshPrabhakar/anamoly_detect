import { useState } from "react";

export default function AlertDetailModal({ alert, onClose }) {
  if (!alert) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Alert #{alert.id}</h3>
        <p>Score: <strong>{alert.score.toFixed(2)}</strong></p>
        <pre>{JSON.stringify(alert.details, null, 2)}</pre>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
