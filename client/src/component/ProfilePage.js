import React, { useEffect, useState } from "react";
import MainLayout from "../component/MainLayout";
import axios from "axios";
import "../styles/ProfilePage.css";

import { auth } from "../firebaseconfig";
import {
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

const ProfilePage = () => {
  const [user, setUser] = useState(null);          // backend user object
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);      // user's reports
  const [computedPoints, setComputedPoints] = useState(0); // points derived from reports
  const [showEdit, setShowEdit] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    newEmail: "",
    currentPassword: "",
  });

  const POINTS_PENDING = 5;
  const POINTS_PICKED = 10;

  const getEcoLevel = (pts) => {
    if (pts < 50) return { level: 1, title: "Eco Rookie 🌱", next: 50 };
    if (pts < 100) return { level: 2, title: "Green Guardian 🍃", next: 100 };
    if (pts < 200) return { level: 3, title: "Eco Hero 🌍", next: 200 };
    if (pts < 500) return { level: 4, title: "Planet Protector 🌏", next: 500 };
    return { level: 5, title: "Legendary Recycler ♻️", next: null };
  };

  const ecoLevel = getEcoLevel(computedPoints);
  const progressPercent = ecoLevel.next
    ? Math.min((computedPoints / ecoLevel.next) * 100, 100)
    : 100;

  // helper: compute points from reports array
  const calculatePointsFromReports = (reportsArray) => {
    if (!Array.isArray(reportsArray)) return 0;
    return reportsArray.reduce((acc, r) => {
      // r.isPicked true => picked, else pending (assuming reported gives 5 even if not picked)
      if (r.isPicked) return acc + POINTS_PICKED;
      return acc + POINTS_PENDING;
    }, 0);
  };

  // fetch user profile
  const fetchProfile = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error("Profile fetch error:", err);
      return null;
    }
  };

  // fetch user's reports for breakdown
  const fetchReports = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/garbage/my-reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data || [];
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      return [];
    }
  };

  // load profile + reports and compute points
  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const loadAll = async () => {
      setLoading(true);
      const [profile, myReports] = await Promise.all([
        fetchProfile(token),
        fetchReports(token),
      ]);

      if (!mounted) return;
      if (profile) {
        setUser(profile);
      }

setReports(myReports);

if (profile?.points !== undefined) {
  setComputedPoints(profile.points);
} else {
  const pts = calculatePointsFromReports(myReports);
  setComputedPoints(pts);
}

// update localStorage for consistency
const updatedUser = { ...(profile || {}), points: profile?.points || computedPoints };
localStorage.setItem("user", JSON.stringify(updatedUser));
setUser(updatedUser);

      setLoading(false);
    };

    loadAll();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // open breakdown: ensure reports are fresh before showing
  const openBreakdown = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowPointsModal(true); // show with current data
      return;
    }
    const freshReports = await fetchReports(token);
    setReports(freshReports);
    const pts = calculatePointsFromReports(freshReports);
    setComputedPoints(pts);

    // update localStorage copy as well
    try {
      const saved = JSON.parse(localStorage.getItem("user") || "{}");
      const updated = { ...saved, points: pts };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser((u) => ({ ...(u || {}), points: pts }));
    } catch (err) {
      // ignore
    }

    setShowPointsModal(true);
  };

  // Edit profile handlers (same as before)
  const handleEditClick = () => {
    setFormData({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      newEmail: "",
      currentPassword: "",
    });
    setShowEdit(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      // Firebase email change if requested
      if (formData.newEmail) {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) throw new Error("No Firebase user logged in.");
        if (!formData.currentPassword)
          throw new Error("Please enter your current password for verification.");

        const credential = EmailAuthProvider.credential(
          firebaseUser.email,
          formData.currentPassword
        );

        await reauthenticateWithCredential(firebaseUser, credential);
        await updateEmail(firebaseUser, formData.newEmail);
        alert("📩 Verification email sent. Please verify it before next login.");
      }

      // update name/phone on backend
      const res = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        { fullName: formData.fullName, phone: formData.phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // refresh profile and keep computed points
      const profileAfter = res.data.user;
      const updatedUser = { ...(profileAfter || {}), points: computedPoints };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setShowEdit(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ " + (err.message || "Failed to update profile"));
    }
  };

  if (loading)
    return (
      <MainLayout active="profile">
        <div className="profile-loader">⏳ Loading your profile...</div>
      </MainLayout>
    );

  if (!user)
    return (
      <MainLayout active="profile">
        <div className="profile-error">
          <p>No user data found. Please log in again.</p>
        </div>
      </MainLayout>
    );

  return (
    <MainLayout active="profile">
      <div className="profile-page">
        {/* Header */}
        <header className="profile-header">
          <div>
            <h1>👋 Hello, {user.fullName || "EcoPickup User"}</h1>
            <p>Let’s keep the city clean together 🌱</p>
          </div>
          <img
            src={user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="User avatar"
            className="profile-avatar-lg"
          />
        </header>

        {/* Main */}
        <section className="profile-content">
          <div className="profile-card">
            <div className="profile-card-header">
              <h2>Profile Information</h2>
              <button className="edit-btn" onClick={handleEditClick}>
                ✏️ Edit
              </button>
            </div>

            <div className="profile-info-grid">
              <div>
                <strong>Email</strong>
                <p>{user.email}</p>
              </div>
              <div>
                <strong>Phone</strong>
                <p>{user.phone || "Not added"}</p>
              </div>
              <div>
                <strong>Role</strong>
                <p>{user.role || "EcoPickup User"}</p>
              </div>
              <div>
                <strong>Member Since</strong>
                <p>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Points */}
          <div className="points-card">
            <h3>🌱 Eco Points</h3>
            <div className="points-value">{computedPoints}</div>
            <p className="points-note">+5 for reporting • +10 for verified pickups</p>
            <button className="breakdown-btn" onClick={openBreakdown}>
              📊 View Breakdown
            </button>
          </div>
        </section>

        {/* Edit Modal */}
        {showEdit && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Edit Profile</h3>
              <form onSubmit={handleUpdate} className="edit-form">
                <label>Full Name</label>
                <input type="text" value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />

                <label>Phone</label>
                <input type="text" value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />

                <label>New Email (optional)</label>
                <input type="email" value={formData.newEmail}
                  onChange={(e) => setFormData({ ...formData, newEmail: e.target.value })} />

                <label>Current Password (for email change)</label>
                <input type="password" value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })} />

                <div className="modal-actions">
                  <button type="submit" className="save-btn">💾 Save</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowEdit(false)}>❌ Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showPointsModal && (
          <div className="modal-overlay">
            <div className="modal modal-wide">
              <h3>🌿 Points & Report Breakdown</h3>

              <table className="breakdown-table">
                <thead>
                  <tr>
                    <th>🗑 Report</th>
                    <th>📍 Location</th>
                    <th>Status</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length > 0 ? (
                    reports.map((r, i) => (
                      <tr key={i}>
                        <td>{r.location || "Unnamed Spot"}</td>
                        <td>{r.address || "N/A"}</td>
                        <td style={{ color: r.isPicked ? "#2e7d32" : "#e67e22", fontWeight: 600 }}>
                          {r.isPicked ? "✅ Picked" : "⏳ Pending"}
                        </td>
                        <td style={{ color: "#1b5e20", fontWeight: 700 }}>
                          {r.isPicked ? `+${POINTS_PICKED}` : `+${POINTS_PENDING}`}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" style={{ textAlign: "center" }}>No reports yet.</td></tr>
                  )}
                </tbody>
              </table>

              <div className="breakdown-total">
                Total Points: <strong>{computedPoints} pts</strong>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowPointsModal(false)}>Close</button>
              </div>
              {/* Eco Level Section */}


            </div>
          </div>
        )}

      </div>
                    <section className="eco-level-card">
                <h3>🏆 Eco Level</h3>
                <p className="eco-level-title">{ecoLevel.title}</p>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                {ecoLevel.next ? (
                  <p className="progress-text">
                    {computedPoints}/{ecoLevel.next} pts to reach next level
                  </p>
                ) : (
                  <p className="progress-text">🌟 You’re at the top tier! ♻️</p>
                )}
              </section>
    </MainLayout>
  );
};

export default ProfilePage;
