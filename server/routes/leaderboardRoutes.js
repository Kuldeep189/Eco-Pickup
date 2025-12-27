const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find().select("fullName points avatar email").sort({ points: -1 }); ;
    res.json(users);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;

