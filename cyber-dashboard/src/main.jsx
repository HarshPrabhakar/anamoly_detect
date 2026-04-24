import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";   // optional, just makes sure the file exists

createRoot(document.getElementById("root")).render(<App />);
