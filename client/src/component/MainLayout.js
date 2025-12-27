import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/sidebar";
import "../styles/Layout.css";

export default function MainLayout({ children, active }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🚫 Redirect to login if not authenticated
    if (!token) {
      navigate("/auth");
      return;
    }

    // 🧠 Fetch the latest user profile (ensures points are up-to-date)
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("user", JSON.stringify(data));
        } else {
          console.warn("Failed to refresh user profile:", data.message);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div className="layout">
      <Sidebar active={active} />
      <div className="content">{children}</div>
    </div>
  );
}
