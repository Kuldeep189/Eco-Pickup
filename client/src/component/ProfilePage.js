import React, { useEffect, useState } from "react";
import MainLayout from "../component/MainLayout";
import ProfileCard from "../component/ProfileCard";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // 🆔 Handle both _id and id key names safely
    const userId = parsedUser._id || parsedUser.id;
    if (!userId) {
      console.warn("⚠️ No user ID found in localStorage.");
      setLoading(false);
      return;
    }

    // 🔄 Fetch updated user profile (to refresh points)
    axios
      .get(`http://localhost:5000/api/auth/profile/${userId}`)
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data)); // ✅ update local storage
      })
      .catch((err) => {
        console.error("❌ Profile fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <MainLayout active="profile">
        <div
          style={{
            textAlign: "center",
            marginTop: "100px",
            fontSize: "1.2rem",
            color: "#666",
          }}
        >
          ⏳ Loading your profile...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout active="profile">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "40px",
          width: "100%",
        }}
      >
        {user ? (
          <ProfileCard user={user} fullWidth={true} />
        ) : (
          <p style={{ fontSize: "1.1rem", color: "#555" }}>
            No user data found. Please log in again.
          </p>
        )}
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
