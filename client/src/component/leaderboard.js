import React, { useEffect, useState } from "react";
import MainLayout from "./MainLayout";
import axios from "axios";
import "../styles/leaderboard.css";

const API_URL = "http://localhost:5000";
console.log("API_URL =", API_URL);

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const getEcoLevel = (pts) => {
    if (pts < 50) return { title: "Eco Rookie 🌱", level: 1 };
    if (pts < 100) return { title: "Green Guardian 🍃", level: 2 };
    if (pts < 200) return { title: "Eco Hero 🌍", level: 3 };
    if (pts < 500) return { title: "Planet Protector 🌏", level: 4 };
    return { title: "Legendary Recycler ♻️", level: 5 };
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));

    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/leaderboard`);
        setLeaders(res.data || []);
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
          <p>Loading leaderboard...</p>
        </div>
      </MainLayout>
    );
  }

  const getMedal = (rank) =>
    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank;

  const getRankClass = (rank) =>
    rank === 1
      ? "rank-gold"
      : rank === 2
      ? "rank-silver"
      : rank === 3
      ? "rank-bronze"
      : "rank-normal";

  return (
    <MainLayout active="leaderboard">
      <div className="leaderboard-page">
        <h2>🏁 Global Eco Leaderboard</h2>
        <p>See how you rank among the EcoHeroes worldwide 🌿</p>

        <div className="leaderboard-container">
          {leaders.length === 0 && (
            <p style={{ color: "#888" }}>No leaderboard data yet 🚧</p>
          )}

          {leaders.map((u, i) => {
            const rank = i + 1;
            const isCurrentUser = user?._id === u._id;

            return (
              <div
                key={u._id}
                className={`leader-card ${isCurrentUser ? "current-user" : ""}`}
              >
                <div className={`rank ${getRankClass(rank)}`}>
                  {getMedal(rank)}
                </div>

                <img
                  src={
                    u.avatar
                      ? `${API_URL}/${u.avatar}`
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
