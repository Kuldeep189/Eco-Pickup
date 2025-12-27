// C:\EcoPickup\client\src\App.js

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import AuthPage from "./pages/Authpage";
import ProfilePage from "./component/ProfilePage";
import MapPage from "./pages/MapPage";
import RewardCenter from "./pages/reward";
import Leaderboard from "./component/leaderboard";

import Chatbot from "./pages/Chatbot";

function App() {
  return (
    <>
      {/* All routes */}
      <Routes>
        {/* Auth pages */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/login" element={<AuthPage defaultTab="login" />} />
        <Route path="/auth/register" element={<AuthPage defaultTab="register" />} />

        {/* Backward compatibility */}
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route path="/register" element={<Navigate to="/auth/register" replace />} />

        {/* Main app pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<Report />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/reward" element={<RewardCenter />} />
        <Route path="/leaderboard" element={<Leaderboard />} />

        {/* Default route */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>

      {/* Floating Chatbot available everywhere */}
      <Chatbot />
    </>
  );
}

export default App;
