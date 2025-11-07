import React from "react";

const ProfileCard = ({ user, fullWidth = false }) => {
  if (!user) {
    return (
      <div style={styles.card(fullWidth)}>
        <h2 style={styles.header}>Your Profile</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.card(fullWidth)}>
      {/* 👤 Profile Header */}
      <div style={styles.headerBox}>
        <img
          src={user.avatar || "https://via.placeholder.com/100"}
          alt="Profile"
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

      {/* 🌱 Points Section */}
      <div style={styles.pointsBox}>
        <h3 style={styles.pointsTitle}>🌱 Eco Points</h3>
        <div style={styles.pointsValueContainer}>
          <span
            style={{
              ...styles.pointsValue,
              transition: "all 0.3s ease",
            }}
          >
            {user.points || 0}
          </span>
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
          <span style={styles.statIcon}>🗑️</span>
          <span style={styles.statText}>Reports</span>
          <strong>{user.reportsCount || 0}</strong>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statIcon}>📍</span>
          <span style={styles.statText}>Locations</span>
          <strong>{user.locationsUpdated || 0}</strong>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statIcon}>✅</span>
          <span style={styles.statText}>Approved</span>
          <strong>{user.reportsApproved || 0}</strong>
        </div>
        <div style={styles.statBox}>
          <span style={styles.statIcon}>🚛</span>
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
    maxWidth: fullWidth ? "800px" : "auto",
    margin: "0 auto",
    transition: "all 0.3s ease",
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
    border: "3px solid #4CAF50",
    objectFit: "cover",
  },

  name: {
    margin: "0",
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#2e7d32",
  },

  role: {
    margin: "2px 0 0 0",
    fontSize: "0.9rem",
    color: "#666",
  },

  divider: {
    border: "none",
    borderBottom: "1px solid #eee",
    margin: "15px 0",
  },

  infoBox: {
    fontSize: "0.9rem",
    color: "#444",
    lineHeight: "1.6",
    marginBottom: "16px",
  },

  pointsBox: {
    background: "linear-gradient(135deg, #e7fbe9, #f2fff5)",
    borderRadius: 12,
    padding: "16px 12px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  },

  pointsTitle: {
    margin: 0,
    color: "#2e7d32",
    fontWeight: "600",
  },

  pointsValueContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    gap: 6,
    margin: "6px 0",
  },

  pointsValue: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1b5e20",
  },

  pointsLabel: {
    fontSize: "1rem",
    color: "#4caf50",
  },

  pointsInfo: {
    fontSize: "0.8rem",
    color: "#666",
  },

  subTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "#2e7d32",
    margin: "10px 0",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },

  statBox: {
    background: "#f8fdf9",
    border: "1px solid #e0f2e9",
    borderRadius: 10,
    padding: "10px 12px",
    textAlign: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
  },

  statIcon: {
    fontSize: "1.2rem",
  },

  statText: {
    display: "block",
    fontSize: "0.8rem",
    color: "#555",
  },
};

export default ProfileCard;
