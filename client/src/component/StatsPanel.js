import React from 'react';

const StatsPanel = () => {
  const stats = [
    { label: "Completed Pickups", value: 24, icon: "✅" },
    { label: "Pending Requests", value: 3, icon: "⏳" },
    { label: "Garbage Reports", value: 12, icon: "🗑️" },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "12px",
      width: "100%",
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          padding: "14px",
          borderRadius: "10px",
          border: "1px solid #e8e8e8",
          textAlign: "center",
          fontWeight: "600",
          boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
        }}>
          <div style={{ fontSize: "22px", marginBottom: "6px" }}>{s.icon} {s.value}</div>
          <div style={{ fontSize: "0.85rem", color: "#444" }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;
