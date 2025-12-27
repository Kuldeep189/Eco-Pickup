import React, { useEffect, useState } from "react";
import MainLayout from "../component/MainLayout";
import "../styles/reward.css";

export default function RewardCenter() {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.points) setPoints(user.points);
  }, []);

  const [popup, setPopup] = useState({
    show: false,
    title: "",
    message: "",
    success: true,
  });

  const rewards = [
    {
      category: "Eco Rewards",
      title: "🌱 Plant Donation",
      description: "Exchange 100 points to donate a tree in your name.",
      cost: 100,
      type: "eco",
    },
    {
      category: "Eco Rewards",
      title: "🏅 Eco Warrior Badge",
      description: "Unlock this badge at 500 points.",
      cost: 500,
      type: "badge",
    },
    {
      category: "Brand Coupons",
      title: "🛍️ Amazon ₹100 Gift Card",
      description: "Redeem 300 points to get ₹100 Amazon gift card.",
      cost: 300,
      brand: "Amazon",
      logo: "https://images.seeklogo.com/logo-png/40/1/amazon-icon-logo-png_seeklogo-405254.png",
    },
    {
      category: "Brand Coupons",
      title: "☕ Starbucks 20% Off Coupon",
      description: "Redeem 200 points for a Starbucks discount coupon.",
      cost: 200,
      brand: "Starbucks",
      logo: "https://images.seeklogo.com/logo-png/13/1/starbucks-logo-png_seeklogo-131765.png",
    },
    {
      category: "Discount Offers",
      title: "👟 Nike 10% Off Voucher",
      description: "Redeem 250 points for a Nike discount code.",
      cost: 250,
      brand: "Nike",
      logo: "https://cdn-icons-png.flaticon.com/512/731/731962.png",
    },
    {
      category: "Discount Offers",
      title: "💄 Nykaa 15% Off Coupon",
      description: "Redeem 150 points for Nykaa discount code.",
      cost: 150,
      brand: "Nykaa",
      logo: "https://images.seeklogo.com/logo-png/35/1/nykaa-logo-png_seeklogo-358073.png",
    },
  ];

  return (
    <MainLayout active="reward">
      <div className="reward-center">
        <h2>🎁 Reward Center</h2>
        <p>
          You have <b>{points}</b> Eco Points. Redeem them for exclusive coupons and rewards!
        </p>

        {/* Category-wise display */}
        {["Eco Rewards", "Brand Coupons", "Discount Offers"].map((category) => (
          <div key={category} className="reward-section">
            <h3 className="reward-category">{category}</h3>
            <div className="reward-grid">
              {rewards
                .filter((r) => r.category === category)
                .map((r, index) => (
                  <div
                    key={index}
                    className={`reward-card ${points < r.cost ? "locked" : ""}`}
                  >
                    {r.logo && (
                      <img
                        src={r.logo}
                        alt={`${r.brand || "reward"} logo`}
                        className="brand-logo"
                      />
                    )}
                    <h4>{r.title}</h4>
                    <p className="reward-desc">{r.description}</p>
                    <p className="reward-cost">{r.cost} pts</p>

                    <button
                      disabled={points < r.cost}
                      onClick={() => {
                        if (points < r.cost) {
                          setPopup({
                            show: true,
                            type: "error",
                            title: "Not Enough Points",
                            message: `You need ${r.cost - points} more points to redeem this reward.`,
                          });
                          return;
                        }

                        // 🌱 ECO REWARD (plant donation, eco badge)
                        if (r.category === "Eco Rewards") {
                          setPopup({
                            show: true,
                            type: "eco",
                            title: "Plantation Success 🌱",
                            message: `Your action contributed to ${r.title}! Thank you for making Earth greener.`,
                          });
                          return;
                        }

                        // 🛍 BRAND COUPON
                        if (r.category === "Brand Coupons" || r.category === "Discount Offers") {
                          setPopup({
                            show: true,
                            type: "brand",
                            title: "Coupon Sent 📩",
                            message: `Your coupon for ${r.title} has been sent to your registered email.Please check your inbox.`,
                          });
                          return;
                        }
                      }}


                    >
                      {points < r.cost ? "Locked" : "Redeem"}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {popup.show && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className={`popup-icon ${popup.success ? "popup-success" : "popup-error"}`}>
              {popup.success ? "🎉" : "⚠️"}
            </div>

            <h3>{popup.title}</h3>
            <p>{popup.message}</p>

            <button className="popup-close" onClick={() => setPopup({ ...popup, show: false })}>
              Close
            </button>
          </div>
        </div>
      )}
      {popup.show && (
        <div className="popup-overlay">
          <div className="popup-box">

            {/* Different icons based on popup type */}
            <div className="popup-icon">
              {popup.type === "eco" && "🌱"}
              {popup.type === "brand" && "📩"}
              {popup.type === "error" && "⚠️"}
            </div>

            <h3>{popup.title}</h3>
            <p>{popup.message}</p>

            <button
              className="popup-close"
              onClick={() => setPopup({ ...popup, show: false })}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </MainLayout>
  );
}
