import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../component/MainLayout";
import ProfileCard from "../component/ProfileCard";
import StatsPanel from "../component/StatsPanel";
import GarbageMap from "../component/GarbageMap";
import Notifications from "../component/Notifications";
import "../styles/Dashboard.css";
import Chatbot from "./Chatbot";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch("http://localhost:5000/api/garbage/recent", {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setRecentReports(data);
    })
    .catch((err) => console.error("Recent reports fetch error:", err));
}, []);


  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    
    setRecentReports([
      { id: 1, location: "Sector 21", status: "✅ Picked", points: 10 },
      { id: 2, location: "Bus Stand", status: "🕒 Pending", points: 0 },
      { id: 3, location: "Park Street", status: "🚛 In Progress", points: 5 },
    ]);
  }, []);

  return (
    <MainLayout active="dashboard">

      {/* 🔝 Top Header */}
      <div className="dashboard-top">
        <div>
          <h2 className="title">👋 Hello, {user?.fullName || "User"}</h2>
          <p className="subtitle">Let’s keep the city clean together 🌱</p>
        </div>

        {/* 🔔 Notifications */}
        <div className="top-actions">
          <Notifications />
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-wrapper">
        <div className="left-block">
          <ProfileCard user={user} />
        </div>

        <div className="right-block">
          <div className="section-card">
            <h3 className="section-title">📋 Recent Reports</h3>

            {recentReports.map((r) => (
              <div key={r.id} className="report-row">
                <span>📍 {r.location}</span>
                <span>{r.status}</span>
                <span className="pts-badge">+{r.points}</span>
              </div>
            ))}

            <button
              className="view-map-overlay-btn"
              onClick={() => setShowMap(true)}
            >
              🗺️ View Map
            </button>
          </div>

          <div className="section-card">
            <StatsPanel />
          </div>
        </div>
      </div>

      {/* 🌍 Map Overlay */}
      {showMap && (
        <div className="map-overlay">
          <div className="map-overlay-content">
            <button className="close-map-btn" onClick={() => setShowMap(false)}>
              ✖ Close
            </button>
            <GarbageMap />
          </div>
        </div>
      )}

      <Chatbot />
    </MainLayout>
  );
}
