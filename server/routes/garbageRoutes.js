const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  reportGarbage,
  getUserReports,
  markAsPicked,
  getRecentReports,   
} = require("../controllers/garbageController");
const authMiddleware = require("../middleware/authmidlleware");
const { sendNotification } = require("../services/notificationService");


// 🔧 Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// 🟢 Routes
router.post("/report", upload.single("image"), reportGarbage);
router.get("/my-reports", authMiddleware, getUserReports);
router.put("/mark-picked/:reportId", markAsPicked); 
router.get("/recent", authMiddleware, getRecentReports);
router.post("/report", authMiddleware, async (req, res) => {
  try {
    const { location, description } = req.body;

    const garbage = new Garbage({
      user: req.user.id,
      location,
      description,
      status: "Pending",
    });

    await garbage.save();

    // 🔔 ADD THIS EXACTLY HERE (IMPORTANT)
    sendNotification(
      req.user.id,
      "🗑️ Garbage reported successfully. Our team will take action soon."
    );

    res.status(201).json({
      message: "Garbage reported successfully",
      garbage,
    });

  } catch (err) {
    console.error("Garbage report error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
