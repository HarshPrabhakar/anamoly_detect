// src/services/api.js
import axios from "axios";

const API_BASE = "http://localhost:5000";   // change to your backend

export default {
  // polls for alerts (adjusted for the endpoint you implemented)
  getAlerts: () => axios.get(`${API_BASE}/alerts`),

  // sends a packet’s feature vector to the analyse endpoint
  evaluatePacket: (features) =>
    axios.post(`${API_BASE}/predict`, { features }),
};
