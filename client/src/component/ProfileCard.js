import React from "react";
import "../styles/ProfileCard.css";

const ProfileCard = ({ user, fullWidth = false }) => {
  if (!user) {
    return (
      <div style={{ ...styles.card(fullWidth), animation: "fadeIn 0.5s ease" }}>
        <h2>Your Profile</h2>
        <p>Loading...</p>
      </div>
    );
  }

  // ✅ SAFE DEFAULT
  const recentReports = user.recentReports || [];

  return (
    <div className="profile-card" style={styles.card(fullWidth)}>
      {/* 👤 Profile Header */}
      <div style={styles.headerBox}>
        <img
          src={
            user.avatar ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="User Profile"
          style={styles.avatar}
        />
        <div>
          <h2 style={styles.name}>{user.fullName}</h2>
          <p style={styles.role}>{user.role || "EcoPickup User"}</p>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* 📧 Contact Info */}
      <div style={styles.infoBox}>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
      </div>

      {/* 🌱 Points */}
      <div style={styles.pointsBox}>
        <h3 style={styles.pointsTitle}>🌱 Eco Points</h3>
        <div style={styles.pointsValueContainer}>
          <span style={styles.pointsValue}>{user.points || 0}</span>
          <span style={styles.pointsLabel}>pts</span>
        </div>
        <p style={styles.pointsInfo}>
          +5 points for reporting & +10 after pickup!
        </p>
      </div>

      {/* 📊 Activity Summary */}
      <h4 style={styles.subTitle}>Activity Summary</h4>
      <div style={styles.statsGrid}>
        <div style={styles.statBox}>
          <span style={styles.statText}>Reports</span>
          <strong>{user.reportsCount || 0}</strong>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statText}>Locations</span>
          <strong>{user.locationsUpdated || 0}</strong>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statText}>Approved</span>
          <strong>{user.reportsApproved || 0}</strong>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statText}>Pickups</span>
          <strong>{user.pickupsCompleted || 0}</strong>
        </div>
      </div>

    </div>
  );
};

const styles = {
  card: (fullWidth) => ({
    background: "#ffffff",
    borderRadius: 16,
    padding: "24px 28px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    width: fullWidth ? "90%" : "350px",
    margin: "0 auto",
  }),

  headerBox: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    marginBottom: 12,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    objectFit: "cover",
  },

  name: {
    margin: 0,
    fontSize: "1.4rem",
    fontWeight: 600,
    color: "#2e7d32",
  },

  role: {
    fontSize: "0.9rem",
    color: "#666",
  },

  divider: {
    borderBottom: "1px solid #eee",
    margin: "15px 0",
  },

  infoBox: {
    fontSize: "0.9rem",
    color: "#444",
    marginBottom: 16,
  },

  pointsBox: {
    background: "#f2fff5",
    borderRadius: 12,
    padding: 16,
    textAlign: "center",
    marginBottom: 20,
  },

  pointsTitle: { color: "#2e7d32" },

  pointsValueContainer: {
    display: "flex",
    justifyContent: "center",
    gap: 6,
  },

  pointsValue: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#1b5e20",
  },

  pointsLabel: { color: "#4caf50" },

  pointsInfo: {
    fontSize: "0.8rem",
    color: "#666",
  },

  subTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#2e7d32",
    margin: "12px 0",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },

  statBox: {
    background: "#f8fdf9",
    border: "1px solid #e0f2e9",
    borderRadius: 10,
    padding: 10,
    textAlign: "center",
  },

  statText: {
    fontSize: "0.8rem",
    color: "#555",
  },

  recentList: {
    fontSize: "0.85rem",
    marginTop: 4,
  },

  recentItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    borderBottom: "1px dashed #e0f2e9",
  },

  recentLocation: {
    maxWidth: "65%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  recentStatus: {
    fontSize: "0.8rem",
    fontWeight: 500,
  },

  emptyText: {
    fontSize: "0.8rem",
    color: "#777",
  },
};

export default ProfileCard;
