const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Alerts API
app.get("/alerts", (req, res) => {
  res.json({
    alerts: Array.from({ length: 20 }, (_, i) => ({
      ts: Date.now() - i * 5000,
      score: Math.floor(Math.random() * 100),
    })),
  });
});

// ✅ Predict API (for future ML use)
app.post("/predict", (req, res) => {
  const { features } = req.body;

  res.json({
    anomalyScore: Math.random(),
    isAnomaly: Math.random() > 0.7,
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});