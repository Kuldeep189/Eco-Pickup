import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar({ active }) {
  const navigate = useNavigate();

  const menu = [
    { label: "Dashboard", icon: "🏠", path: "/dashboard", key: "dashboard" },
    { label: "Profile", icon: "👤", path: "/profile", key: "profile" },
    { label: "Report Garbage", icon: "🗑️", path: "/report", key: "report" },
    { label: "Map", icon: "🗺️", path: "/map", key: "map" },
  ];

  return (
    <div className="sidebar">
      <h1 className="logo">EcoPickup 🌱</h1>

      {menu.map((m) => (
        <button
          key={m.key}
          className={active === m.key ? "menu active" : "menu"}
          onClick={() => navigate(m.path)}
        >
          {m.icon} {m.label}
        </button>
      ))}

      <button
        className="logout"
        onClick={() => {
          localStorage.clear();
          navigate("/auth");
        }}
      >
        🚪 Logout
      </button>
    </div>
  );
}
