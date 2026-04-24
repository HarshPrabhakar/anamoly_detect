import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AlertsProvider } from "./context/AlertsContext";
import Home from "./pages/Home";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import "./assets/styles/globals.css";

export default function App() {
  return (
    <Router>
      <AlertsProvider>
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </AlertsProvider>
    </Router>
  );
}
