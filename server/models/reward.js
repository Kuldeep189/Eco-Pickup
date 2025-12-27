const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  cost: { type: Number, default: 0 },
  category: { type: String, default: "Eco Rewards" }, // Brand Coupons, Discount Offers
  stock: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  minLevel: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Reward", rewardSchema);
