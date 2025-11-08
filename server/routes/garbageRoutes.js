const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  reportGarbage,
  getUserReports,
  markAsPicked,
} = require("../controllers/garbageController");
const authMiddleware = require("../middleware/authmidlleware");

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
router.put("/mark-picked/:reportId", markAsPicked); // ✅ Added
router.get('/', (req, res) => {
  res.json({ message: 'Garbage route working ✅' });
});

module.exports = router;
