import React from "react";
import "../styles/StatsPanel.css";

const StatsPanel = ({ stats }) => {
  if (!stats) return null;

  const items = [
    {
      label: "Completed Pickups",
      value: stats.completedPickups,
      icon: "✅",
    },
    {
      label: "Pending Requests",
      value: stats.pendingRequests,
      icon: "⏳",
    },
    {
      label: "Garbage Reports",
      value: stats.totalReports,
      icon: "🗑️",
    },
  ];

  return (
    <div className="stats-grid">
      {items.map((s, i) => (
        <div key={i} className="stat-card">
          <div className="stat-value">
            <span className="stat-icon">{s.icon}</span>
            {s.value}
          </div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;
