import React, { useEffect, useState } from "react";
import MainLayout from "./MainLayout";
import axios from "axios";
import "../styles/leaderboard.css";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  // Calculate Eco Level from points
  const getEcoLevel = (pts) => {
    if (pts < 50) return { title: "Eco Rookie 🌱", level: 1 };
    if (pts < 100) return { title: "Green Guardian 🍃", level: 2 };
    if (pts < 200) return { title: "Eco Hero 🌍", level: 3 };
    if (pts < 500) return { title: "Planet Protector 🌏", level: 4 };
    return { title: "Legendary Recycler ♻️", level: 5 };
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/leaderboard");
        setLeaders(res.data);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <MainLayout active="leaderboard">
        <div className="leaderboard-page">
          <p>⏳ Loading leaderboard...</p>
        </div>
      </MainLayout>
    );
  }

  const getMedal = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  const getRankClass = (rank) => {
    if (rank === 1) return "rank-gold";
    if (rank === 2) return "rank-silver";
    if (rank === 3) return "rank-bronze";
    return "rank-normal";
  };
const getLevelProgress = (points) => {
  if (points < 50) return { level: 1, next: 50, title: "Eco Rookie 🌱" };
  if (points < 100) return { level: 2, next: 100, title: "Green Guardian 🍃" };
  if (points < 200) return { level: 3, next: 200, title: "Eco Hero 🌍" };
  if (points < 500) return { level: 4, next: 500, title: "Planet Protector 🌏" };
  return { level: 5, next: null, title: "Legendary Recycler ♻️" };
};

  return (
    <MainLayout active="leaderboard">
      <div className="leaderboard-page">
        <h2>🏁 Global Eco Leaderboard</h2>
        <p>See how you rank among the EcoHeroes worldwide 🌿</p>

        <div className="leaderboard-container">
          {leaders.map((u, i) => {
            const rank = i + 1;
            const isCurrentUser = user?._id === u._id;

            return (
              <div
                key={i}
                className={`leader-card ${isCurrentUser ? "current-user" : ""}`}
              >
                <div className={`rank ${getRankClass(rank)}`}>
                  {getMedal(rank)}
                </div>

                <img
                  src={
                    u.avatar
                      ? `http://localhost:5000/${u.avatar}`
                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="User Avatar"
                  className="leader-avatar"
                />

                <div className="leader-info">
                  <h4>{u.fullName}</h4>

                  <p className="eco-level-badge">
                    {getEcoLevel(u.points).title}
                  </p>
                </div>
                    

                <div className="leader-points">
                  <strong>{u.points}</strong> pts
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
