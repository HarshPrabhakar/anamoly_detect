import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const links = [
    { path: "/", label: "Home" },
    { path: "/alerts", label: "Alerts" },
    { path: "/settings", label: "Settings" },
  ];

  return (
    <nav className="app-navbar">
      <h1>Anomaly Dashboard</h1>
      <ul>
        {links.map((l) => (
          <li key={l.path}>
            <Link
              to={l.path}
              className={location.pathname === l.path ? "active" : ""}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
