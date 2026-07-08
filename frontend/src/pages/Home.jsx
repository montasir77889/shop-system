import {
  FaHome,
  FaBoxes,
  FaCashRegister,
  FaChartBar,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { useState } from "react";

import Dashboard from "../components/Dashboard";
import Inventory from "../components/Inventory";
import Billing from "../components/Billing";
import Reports from "../components/Reports";




export default function Home() {
  const [tab, setTab] = useState("dashboard");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";
  const TABS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <FaHome />,
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: <FaBoxes />,
  },
  {
    id: "billing",
    label: "Billing",
    icon: <FaCashRegister />,
  },

  ...(isAdmin
    ? [
        {
          id: "reports",
          label: "Reports",
          icon: <FaChartBar />,
        },
      ]
    : []),
  ];
  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/";
};
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">SS</span>

          <div>
            <div className="brand-name">Shop System</div>

            <div className="brand-sub">
              Inventory & Billing
            </div>
          </div>
        </div>
        <div className="user-card">
          <FaUserCircle className="user-avatar" />

          <div>
            <div className="user-name">
              {user?.name}
          </div>

          <div className="user-email">
            {user?.email}
          </div>

          <div className="role-badge">
            {user?.role}
          </div>
        </div>
      </div>

        <nav>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`nav-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
            <button
              className="logout-btn"
              onClick={logout}
            >
              <FaSignOutAlt/> 

              <span>Logout</span>
            </button>   
      </aside>

      <main className="content">
        {tab === "dashboard" && <Dashboard />}
        {tab === "inventory" && <Inventory />}
        {tab === "billing" && <Billing />}
        {tab === "reports" && isAdmin && <Reports />}
      </main>
    </div>
  );
}