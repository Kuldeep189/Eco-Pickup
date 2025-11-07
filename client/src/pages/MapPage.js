import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/sidebar"; // ✅ Use same reusable sidebar
import GarbageMap from "../component/GarbageMap";
import "../styles/MapPage.css";

export default function MapPage() {
  const navigate = useNavigate();

  return (
    <div className="layout">
      <Sidebar active="map" />

      <div className="content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ⬅ Back
          </button>
          <h2>Garbage Locations Map</h2>
        </div>

        <div className="map-card">
          <GarbageMap />
        </div>
      </div>
    </div>
  );
}
