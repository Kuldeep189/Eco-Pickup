import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import AuthPage from "./pages/Authpage";
import ProfilePage from "./component/ProfilePage";
import MapPage from "./pages/MapPage"; // if needed

function App() {
  return (
    <Routes>
      {/* ✅ Auth pages */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/login" element={<AuthPage defaultTab="login" />} />
      <Route path="/auth/register" element={<AuthPage defaultTab="register" />} />

      {/* ✅ Backward URL support */}
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="/register" element={<Navigate to="/auth/register" replace />} />

      {/* ✅ Main protected app pages */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/report" element={<Report />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/map" element={<MapPage />} />

      {/* ✅ Default — redirect to auth */}
      <Route path="/" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

export default App;
