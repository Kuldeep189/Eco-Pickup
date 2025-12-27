const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const { registerUser, loginUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authmidlleware');
const User = require('../models/user');
const { sendNotification } = require("../services/notificationService");


// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });


// ================= REGISTER =================
router.post('/register', upload.single('avatar'), async (req, res) => {
  try {
    const user = await registerUser(req, res);

    if (user?.id) {
      sendNotification(
        user.id,
        "🎉 Welcome to EcoClean! Your account has been created successfully."
      );
    }
  } catch (error) {
    console.error("Register error:", error);
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const result = await loginUser(req, res);

    // ⛔ loginUser already sent response, so we STOP here
    if (!req.user && !result) return;

    // 🔔 SEND NOTIFICATION MANUALLY
    if (result?.user?._id) {
      sendNotification(
        result.user._id.toString(),
        "👋 Login successful. Welcome back!"
      );
    }
  } catch (err) {
    console.error("Login notification error:", err);
  }
});


// ================= PROFILE =================
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const userWithAvatar = {
      ...user._doc,
      avatar: user.avatar
        ? `${req.protocol}://${req.get('host')}/${user.avatar}`
        : '',
    };

    res.json(userWithAvatar);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// ================= UPDATE PROFILE =================
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const { fullName, phone, avatar } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    sendNotification(
      user.id,
      "✏️ Your profile has been updated successfully."
    );

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= UPDATE ECO POINTS =================
router.post('/update-points', authMiddleware, async (req, res) => {
  try {
    const { pointsToAdd } = req.body;

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.points = (user.points || 0) + (pointsToAdd || 0);
    await user.save();

    sendNotification(
      user.id,
      `🌱 You earned +${pointsToAdd} Eco Points! Keep helping the city clean.`
    );

    res.status(200).json({
      message: 'Points updated successfully',
      newPoints: user.points,
    });
  } catch (error) {
    console.error('Error updating points:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
